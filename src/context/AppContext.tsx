import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const API_URL = import.meta.env.PROD ? 'https://sixth-sense1.onrender.com' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');
const WS_URL = import.meta.env.PROD ? 'wss://sixth-sense1.onrender.com' : (import.meta.env.VITE_WS_URL || 'ws://localhost:3001');
export interface AlertData {
  id: number;
  type: 'critical' | 'warning' | 'info';
  title: string;
  location: string;
  time: string;
  cameraId?: number;
  snapshotBase64?: string;
  aiReasoning?: string;
}

export interface CameraData {
  id: string;
  name: string;
  status: 'online' | 'offline';
  protocol: 'RTSP' | 'ONVIF' | 'WebRTC';
  res: string;
  fps: number;
  bitrate: string;
  url?: string;
  wsPort?: number;
}

export interface FaceData {
  id: number;
  name: string;
  role: string;
  image: string;
  status: 'active' | 'inactive';
}

export interface AccessLogData {
  id: string;
  time: string;
  user: string;
  role: string;
  door: string;
  status: 'granted' | 'denied';
  method: string;
  timestamp: number;
}

interface AppSettings {
  id?: number;
  apiKey: string;
  isAiEnabled: boolean;
  customPrompt: string;
  systemBasePrompt: string;
  confidenceThreshold: number;
  inferenceFramerate: number;
  enableAutoSiren: boolean;
  facilityName: string;
  timezone: string;
  darkMode: boolean;
}

interface AppContextType {
  alerts: AlertData[];
  activeAlertCameras: Record<number, string>;
  settings: AppSettings;
  cameras: CameraData[];
  faces: FaceData[];
  accessLogs: AccessLogData[];
  triggerAlert: (type: 'unauthorized' | 'weapon' | 'loitering' | 'custom', cameraId: number, snapshotBase64?: string, aiReasoning?: string) => void;
  clearAlerts: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addCamera: (camera: CameraData) => void;
  addFace: (face: FaceData) => void;
  addAccessLog: (log: AccessLogData) => void;
  isLoaded: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  isAiEnabled: false,
  customPrompt: '',
  systemBasePrompt: '',
  confidenceThreshold: 85,
  inferenceFramerate: 12,
  enableAutoSiren: true,
  facilityName: 'Main Office Site',
  timezone: 'UTC',
  darkMode: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [activeAlertCameras, setActiveAlertCameras] = useState<Record<number, string>>({});
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [faces, setFaces] = useState<FaceData[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLogData[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch initial state from Database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, camerasRes, alertsRes, facesRes] = await Promise.all([
          fetch(`${API_URL}/api/settings`).catch(() => null),
          fetch(`${API_URL}/api/cameras`).catch(() => null),
          fetch(`${API_URL}/api/alerts`).catch(() => null),
          fetch(`${API_URL}/api/faces`).catch(() => null)
        ]);

        if (settingsRes && settingsRes.ok) setSettings(await settingsRes.json());
        if (camerasRes && camerasRes.ok) setCameras(await camerasRes.json());
        if (alertsRes && alertsRes.ok) setAlerts(await alertsRes.json());
        if (facesRes && facesRes.ok) setFaces(await facesRes.json());
        
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load initial data from DB", err);
        setIsLoaded(true); // fall back to defaults
      }
    };
    fetchData();
  }, []);

  // Connect to backend alerts WebSocket
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/alerts`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.threatDetected) {
          // data.cameraId is a string like "CAM-01", we need the number for triggerAlert
          const camNum = parseInt(data.cameraId.replace('CAM-', ''), 10) || 1;
          triggerAlert(data.threatType, camNum, data.snapshotBase64, data.aiReasoning);
          
          // Also prepend the new alert to our local state
          setAlerts(prev => [data, ...prev].slice(0, 50));
        }
      } catch (err) {
        console.error('Error parsing alert message', err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Persist to DB
    try {
      await fetch(`${API_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      console.error("Failed to persist settings", e);
    }
  };

  const addCamera = async (camera: Partial<CameraData>) => {
    try {
      const res = await fetch(`${API_URL}/api/cameras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(camera)
      });
      if (res.ok) {
        const newCamera = await res.json();
        setCameras(prev => [...prev, newCamera]);
      }
    } catch (e) {
      console.error("Failed to add camera", e);
    }
  };

  const addFace = async (face: Omit<FaceData, 'id' | 'status'>) => {
    try {
      const res = await fetch(`${API_URL}/api/faces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(face)
      });
      if (res.ok) {
        const newFace = await res.json();
        setFaces(prev => [newFace, ...prev]);
      }
    } catch (e) {
      console.error("Failed to add face", e);
    }
  };

  const addAccessLog = (log: AccessLogData) => {
    setAccessLogs(prev => [log, ...prev]);
  };

  const triggerAlert = (type: 'unauthorized' | 'weapon' | 'loitering' | 'custom', cameraId: number, snapshotBase64?: string, aiReasoning?: string) => {
    let alertType: AlertData['type'] = 'critical';
    let title = '';
    
    if (type === 'unauthorized') {
      title = 'Unauthorized Access';
    } else if (type === 'weapon') {
      title = 'Weapon Detected';
    } else if (type === 'loitering') {
      title = 'Loitering Detected';
      alertType = 'warning';
    } else if (type === 'custom') {
      title = 'Custom Threat Detected';
    }

    if (alertType === 'critical' && settings.enableAutoSiren) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          osc2.type = 'square';
          osc2.frequency.setValueAtTime(880, ctx.currentTime);
          osc2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.1);
        }, 150);
      } catch(e) {}
    }

    setActiveAlertCameras(prev => ({ ...prev, [cameraId]: title }));
  };

  const clearAlerts = () => {
    setActiveAlertCameras({});
  };

  return (
    <AppContext.Provider value={{
      alerts,
      activeAlertCameras,
      settings,
      cameras,
      faces,
      accessLogs,
      triggerAlert,
      clearAlerts,
      updateSettings,
      addCamera,
      addFace,
      addAccessLog,
      isLoaded
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
