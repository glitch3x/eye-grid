import { AlertTriangle, Shield, Crosshair, Key, Play, Square } from 'lucide-react';

interface SimulationControlsProps {
  isAiEnabled: boolean;
  onToggleAi: () => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  onTriggerAlert: (type: 'unauthorized' | 'weapon' | 'loitering' | 'custom', cameraId: number) => void;
  onClearAlerts: () => void;
}

export function SimulationControls({ 
  isAiEnabled, onToggleAi, customPrompt, onCustomPromptChange, onTriggerAlert, onClearAlerts 
}: SimulationControlsProps) {
  return (
    <div className="bg-card-dark border border-card-border rounded-xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h3 className="font-heading font-semibold text-sm flex items-center gap-2 text-slate-300 whitespace-nowrap">
          <Crosshair className="w-4 h-4 text-primary-500" />
          AI Engine Controls
        </h3>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={onToggleAi}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
              isAiEnabled 
                ? 'bg-primary-500/20 text-primary-400 border-primary-500/30 hover:bg-primary-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isAiEnabled ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isAiEnabled ? 'Stop AI' : 'Start AI Inference'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 pt-3 border-t border-card-border/50">
        <div className="flex items-center gap-2 w-full">
           <span className="text-xs text-slate-400 uppercase font-semibold whitespace-nowrap">Custom Instruction:</span>
           <input
              type="text"
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              placeholder="e.g. Flag anyone wearing a red hat"
              className="flex-1 px-3 py-1.5 border border-card-border rounded-md bg-bg-dark text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-xs transition-colors"
           />
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button 
            onClick={onClearAlerts}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors"
          >
            Clear Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
