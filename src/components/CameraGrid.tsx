import { useEffect, useRef, useState } from 'react';
import { Video, Maximize, ZoomIn, Aperture, Power, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';

interface CameraGridProps {
  activeAlertCameras: Record<number, string>;
  apiKey?: string;
  isAiEnabled?: boolean;
  customPrompt?: string;
  onAiTrigger?: (type: 'unauthorized' | 'weapon' | 'loitering' | 'custom', cameraId: number, snapshotBase64?: string, aiReasoning?: string) => void;
}

import { useApp } from '../context/AppContext';

export function CameraGrid({ activeAlertCameras, isAiEnabled, customPrompt }: CameraGridProps) {
  const { cameras } = useApp();
  const [selectedCamId, setSelectedCamId] = useState<string>('CAM-01');
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [recordings, setRecordings] = useState<any[]>([]);
  
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  // Sync AI state with backend
  useEffect(() => {
    if (isAiEnabled) {
      fetch('http://localhost:3001/api/ai/start', { method: 'POST' }).catch(console.error);
    } else {
      fetch('http://localhost:3001/api/ai/stop', { method: 'POST' }).catch(console.error);
    }
  }, [isAiEnabled]);

  useEffect(() => {
    if (customPrompt !== undefined) {
      fetch('http://localhost:3001/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customPrompt })
      }).catch(console.error);
    }
  }, [customPrompt]);

  // Fetch NVR Recordings Timeline
  useEffect(() => {
    fetch('http://localhost:3001/api/recordings')
      .then(r => r.json())
      .then(data => setRecordings(data))
      .catch(console.error);
  }, []);

  const handlePtz = (command: string) => {
    fetch(`http://localhost:3001/api/cameras/CAM-01/ptz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });
  };

  // Setup JSMpeg for active camera
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    const selectedCam = cameras.find(c => c.id === selectedCamId);
    
    if (isPowerOn && selectedCam) {
      if (selectedCam.url === 'webcam') {
        // Fallback to local webcam
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            if (videoRef.current) videoRef.current.srcObject = stream;
          })
          .catch(console.error);
      } else if (mainCanvasRef.current) {
        // Use RTSP/MP4 via WebSockets
        // @ts-ignore
        if (window.JSMpeg) {
          // @ts-ignore
          playerRef.current = new window.JSMpeg.Player(`ws://localhost:${selectedCam.wsPort}`, {
            canvas: mainCanvasRef.current,
            autoplay: true,
            audio: false
          });
        }
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [selectedCamId, isPowerOn]);

  const selectedCam = cameras.find(c => c.id === selectedCamId);
  const isAlert = !!activeAlertCameras[parseInt((selectedCamId || '1').replace('CAM-', ''))];

  // Dummy fallback images for cameras without streams
  const getThumbnailStyle = (index: number) => {
    if (index === 0) return {};
    return {
      backgroundImage: `url('https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=400&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'grayscale(50%) contrast(1.2)'
    };
  };

  return (
    <>
      {/* Main Active Stream View */}
      <div className={`relative aspect-video bg-slate-950 rounded-2xl border overflow-hidden shadow-2xl group mb-6 transition-colors duration-300 ${isAlert ? 'border-rose-500 shadow-rose-500/20' : 'border-slate-800'}`}>
        
        {selectedCam?.url === 'webcam' ? (
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!isPowerOn ? 'hidden' : 'block'}`}
          />
        ) : (
          <canvas 
            ref={mainCanvasRef}
            className={`w-full h-full object-cover ${!isPowerOn || !selectedCam ? 'hidden' : 'block'}`}
          />
        )}

        {(!isPowerOn || !selectedCam) && (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 font-mono space-y-2 bg-slate-950">
            <Video className="w-8 h-8 opacity-50" />
            <span>{!isPowerOn ? 'CAMERA OFFLINE' : 'NO STREAM SOURCE'}</span>
          </div>
        )}

        {/* AI Vision Overlay (Bounding Box) */}
        {isAlert && (
          <div className="absolute top-[22%] left-[32%] w-[32%] h-[58%] border-2 border-rose-500 bg-rose-500/10 rounded-xl backdrop-blur-[1px] flex flex-col justify-between p-3 animate-pulse pointer-events-none">
            <div className="flex items-center justify-between">
              <span className="bg-rose-500 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                THREAT DETECTED
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            </div>
            <div className="bg-slate-950/90 border border-rose-500/40 p-2 rounded-lg backdrop-blur-md">
              <div className="text-[10px] text-rose-300 font-mono font-bold">GEMMA ALERT:</div>
              <div className="text-[10px] text-slate-200 uppercase">{activeAlertCameras[selectedCamId]}</div>
            </div>
          </div>
        )}

        {/* Feed Overlay Metadata Header */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-3">
          <span className={`w-2 h-2 rounded-full ${!isPowerOn ? 'bg-slate-9500' : isAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
          <span className="text-xs font-mono font-bold text-white uppercase">{selectedCam?.name || 'NO CAMERA'}</span>
        </div>

        {/* Feed Action Controls */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
          
          {/* PTZ Simulation Joypad */}
          <div className="flex flex-col items-center mr-4 bg-slate-900/50 rounded-lg p-1">
            <button onClick={() => handlePtz('up')} className="p-1 hover:bg-slate-700 rounded text-slate-300"><ArrowUp className="w-3 h-3" /></button>
            <div className="flex gap-4">
              <button onClick={() => handlePtz('left')} className="p-1 hover:bg-slate-700 rounded text-slate-300"><ArrowLeft className="w-3 h-3" /></button>
              <button onClick={() => handlePtz('right')} className="p-1 hover:bg-slate-700 rounded text-slate-300"><ArrowRight className="w-3 h-3" /></button>
            </div>
            <button onClick={() => handlePtz('down')} className="p-1 hover:bg-slate-700 rounded text-slate-300"><ArrowDown className="w-3 h-3" /></button>
          </div>

          <button 
            onClick={() => setIsPowerOn(!isPowerOn)}
            className={`p-2 rounded-lg transition-colors ${isPowerOn ? 'hover:bg-slate-800 text-slate-300' : 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30'}`}
            title={isPowerOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            <Power className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"><ZoomIn className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"><Aperture className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"><Maximize className="w-4 h-4" /></button>
        </div>
      </div>

      {/* 4-Camera Grid Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">Active Camera Feeds</h3>
          <span className="text-xs text-slate-400 font-mono">1 Stream Connected</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {cameras.map((cam, idx) => {
            const isActive = selectedCamId === cam.id;
            const hasAlert = !!activeAlertCameras[parseInt(cam.id.replace('CAM-', ''))];
            
            return (
              <div 
                key={cam.id}
                onClick={() => setSelectedCamId(cam.id)}
                className={`
                  cursor-pointer rounded-xl overflow-hidden relative aspect-video transition-all border bg-slate-950
                  ${isActive ? 'ring-2 ring-primary-500 border-primary-500 opacity-100' : 'border-slate-800 hover:border-primary-500/50 opacity-60 hover:opacity-80'}
                  ${hasAlert && !isActive ? 'border-rose-500 opacity-100' : ''}
                `}
                style={getThumbnailStyle(idx)}
              >
                {/* Visual mock for thumbnails without real streams */}
                {idx === 0 && (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-[10px] text-emerald-500 font-mono">LIVE</div>
                )}
                
                <div className={`absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded font-bold
                  ${hasAlert ? 'bg-rose-500 text-white' : 'bg-slate-950/80 text-slate-300'}
                `}>
                  {cam.id}
                </div>
                
                <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full
                  ${hasAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}
                `}></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Feature 1: NVR Timeline Scrubbing */}
      <div className="mt-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-emerald-400" /> NVR Archive Timeline
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
          {recordings.length === 0 ? (
            <div className="text-xs font-mono text-slate-500">No recordings found on disk yet.</div>
          ) : (
            recordings.map((rec, i) => {
              const date = new Date(rec.createdAt);
              return (
                <div key={i} className="min-w-[120px] bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-colors p-3 rounded-xl cursor-pointer group">
                  <div className="text-[10px] text-slate-500 mb-1">{date.toLocaleDateString()}</div>
                  <div className="text-xs font-bold text-slate-300 group-hover:text-white font-mono">{date.toLocaleTimeString()}</div>
                  <div className="text-[10px] text-emerald-500/80 mt-2">{(rec.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
