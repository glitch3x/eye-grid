import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { CameraGrid } from '../components/CameraGrid'
import { AlertFeed } from '../components/AlertFeed'
import { SimulationControls } from '../components/SimulationControls'
import { Clock, Siren } from 'lucide-react'
import { useApp, type AlertData } from '../context/AppContext'

export function Dashboard() {
  const { alerts, activeAlertCameras, settings, triggerAlert, clearAlerts, updateSettings } = useApp()
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null)
  const [isPulsing, setIsPulsing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(timer)
  }, [])

  const triggerSiren = () => {
    setIsPulsing(!isPulsing)
  }

  const headerRight = (
    <>
      <button 
        onClick={triggerSiren} 
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
          isPulsing 
            ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/50 animate-pulse' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
        }`}
      >
        <Siren className="w-4 h-4" />
        <span>{isPulsing ? 'SIREN ACTIVE' : 'MANUAL SIREN'}</span>
      </button>

      <div className="h-6 w-px bg-slate-800"></div>

      <div className="flex items-center space-x-2 text-slate-400 font-mono text-xs">
        <Clock className="w-4 h-4 text-slate-400" />
        <span>{currentTime}</span>
      </div>
    </>
  )

  return (
    <div className={`h-full w-full ${isPulsing ? 'animate-[pulse-red_1s_ease-in-out_infinite]' : ''}`}>
      <Layout headerTitle="Live Command Console" headerRight={headerRight}>
        <div className="h-full flex flex-col lg:grid lg:grid-cols-3 gap-6">
          
          {/* Left Area: Controls & Camera Grid */}
          <div className="lg:col-span-2 flex flex-col min-h-0 space-y-6 overflow-y-auto pr-2 pb-4">
            {/* Simulation controls integrated compactly */}
            <div className="shrink-0 bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
               <SimulationControls 
                  isAiEnabled={settings.isAiEnabled}
                  onToggleAi={() => updateSettings({ isAiEnabled: !settings.isAiEnabled })}
                  customPrompt={settings.customPrompt}
                  onCustomPromptChange={(prompt) => updateSettings({ customPrompt: prompt })}
                  onTriggerAlert={triggerAlert} 
                  onClearAlerts={clearAlerts} 
               />
            </div>
            
            <div className="flex-1">
               <CameraGrid 
                  activeAlertCameras={activeAlertCameras}
                  apiKey={settings.apiKey}
                  isAiEnabled={settings.isAiEnabled}
                  customPrompt={settings.customPrompt}
                  onAiTrigger={triggerAlert}
               />
            </div>
          </div>
          
          {/* Right Area: Incident Feed */}
          <div className="h-[600px] lg:h-auto lg:min-h-0 flex flex-col pb-4">
            <AlertFeed alerts={alerts} onSelectAlert={setSelectedAlert} />
          </div>
        </div>
        
        {/* Incident Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#090D16] border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="font-bold text-lg text-white">Incident Report #{selectedAlert.id}</h3>
                <button onClick={() => setSelectedAlert(null)} className="text-slate-400 hover:text-white transition-colors">
                   Close
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    selectedAlert.type === 'critical' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                  }`}>
                    {selectedAlert.title}
                  </div>
                  <span className="text-sm text-slate-400">{selectedAlert.time} • {selectedAlert.location}</span>
                </div>
                
                {selectedAlert.snapshotBase64 ? (
                  <div className="rounded-lg overflow-hidden border border-slate-800 mb-6">
                    <img src={selectedAlert.snapshotBase64} alt="Incident Snapshot" className="w-full h-auto" />
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-800 mb-6 p-12 flex items-center justify-center text-slate-400 bg-slate-900/50">
                     No snapshot available (Manual Trigger)
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">Gemini Vision Analysis</h4>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-sm text-primary-400 whitespace-pre-wrap leading-relaxed">
                    {selectedAlert.aiReasoning || "Manual trigger event. No AI inference data available."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </div>
  )
}
