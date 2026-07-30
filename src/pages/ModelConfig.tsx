import { Layout } from '../components/Layout'
import { Cpu, Zap, Target, Save, ShieldAlert, Key } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function ModelConfig() {
  const { settings, updateSettings } = useApp()

  const handleSave = () => {
    // In a real app this would sync to a backend.
    // For now, it's saved in context instantly anyway, so we just show a mock save.
    alert("Configuration saved globally.");
  }

  return (
    <Layout headerTitle="Model Configuration">
      <div className="flex flex-col h-full space-y-6 max-w-4xl mx-auto w-full">
        
        {/* Header Alert */}
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 flex gap-4 items-start shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Cpu className="w-4 h-4 text-primary-400" />
          </div>
          <div>
            <h4 className="text-primary-400 font-bold mb-1">Global Configuration Active</h4>
            <p className="text-sm text-slate-300">
              Changes made here will immediately affect the Gemini Flash inference pipeline running on the Live Monitor.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2">
          
          {/* Left Column */}
          <div className="space-y-6">
            


            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                <Target className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-white">Detection Parameters</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">Confidence Threshold</label>
                    <span className="text-xs font-mono text-primary-400 bg-primary-500/10 px-2 py-1 rounded">{settings.confidenceThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" max="99" 
                    value={settings.confidenceThreshold}
                    onChange={(e) => updateSettings({ confidenceThreshold: parseInt(e.target.value) })}
                    className="w-full accent-primary-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-slate-400">Higher values reduce false positives but may miss subtle events.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">Inference Framerate</label>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">{settings.inferenceFramerate} FPS</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="30" 
                    value={settings.inferenceFramerate}
                    onChange={(e) => updateSettings({ inferenceFramerate: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-slate-400">Higher FPS consumes more API quota but provides smoother tracking.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800 shrink-0">
                <Zap className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-white">System Prompts</h3>
              </div>
              
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="space-y-2 flex-1 flex flex-col">
                  <label className="text-sm font-medium text-slate-300 flex justify-between">
                    <span>Base Analytical Prompt</span>
                    <span className="text-xs text-slate-400">System Level</span>
                  </label>
                  <textarea 
                    value={settings.systemBasePrompt}
                    onChange={(e) => updateSettings({ systemBasePrompt: e.target.value })}
                    className="w-full flex-1 min-h-[150px] bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:border-primary-500 resize-none font-mono"
                  />
                </div>

                <div className="space-y-2 shrink-0">
                  <label className="text-sm font-medium text-slate-300 flex justify-between">
                    <span>Auto-Siren Automation</span>
                  </label>
                  <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <input 
                      type="checkbox" 
                      id="siren"
                      checked={settings.enableAutoSiren}
                      onChange={(e) => updateSettings({ enableAutoSiren: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 text-rose-500 focus:ring-rose-500 bg-slate-900"
                    />
                    <label htmlFor="siren" className="text-sm text-slate-300 cursor-pointer">
                      Trigger physical siren on <span className="font-bold text-rose-400">Critical</span> threat detection
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-4 shrink-0">
          <button className="px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Reset to Defaults
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-primary-500/20"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>

      </div>
    </Layout>
  )
}
