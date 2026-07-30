import { ShieldAlert, Info, Clock, AlertTriangle, Cpu, PhoneCall, Volume2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import type { AlertData } from '../context/AppContext';

interface AlertFeedProps {
  alerts: AlertData[];
  onSelectAlert: (alert: AlertData) => void;
}

export function AlertFeed({ alerts, onSelectAlert }: AlertFeedProps) {
  const { triggerAlert, clearAlerts } = useApp();

  return (
    <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 h-full flex flex-col justify-between">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 shrink-0">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Live Gemma Decision Stream</span>
          </div>
          <span className="text-[10px] font-mono bg-primary-500/10 text-primary-400 border border-primary-500/30 px-2 py-0.5 rounded">
            12 FPS Inference
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-2">
          {alerts.map((alert, index) => (
            <AlertItem key={alert.id} alert={alert} index={index} onClick={() => onSelectAlert(alert)} />
          ))}
        </div>
      </div>

      {/* Incident Actions */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2.5 mt-4 shrink-0">
        <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-2">Manual Dispatch Override</div>
        
        <button 
          onClick={() => triggerAlert('custom', 1, undefined, 'Manual override: Rapid response team dispatched by operator.')}
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-sans font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/20"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Dispatch Rapid Response Team</span>
        </button>

        <div className="grid grid-cols-2 gap-2 font-sans">
          <button 
            onClick={() => triggerAlert('loitering', 1, undefined, 'Manual override: Two-way warning speaker triggered by operator.')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Trigger Speaker</span>
          </button>
          <button 
            onClick={clearAlerts}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-medium text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Dismiss All</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ alert, index, onClick }: { alert: AlertData, index: number, onClick: () => void }) {
  const isCritical = alert.type === 'critical';
  const isWarning = alert.type === 'warning';
  
  if (alert.type === 'info') {
    return (
      <motion.div 
        onClick={onClick}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
      >
        <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
          <span>{alert.time}</span>
          <span>SYSTEM</span>
        </div>
        <div className="text-slate-300 font-sans">{alert.title}: {alert.location}</div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      onClick={onClick}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`
        p-3 rounded-xl border cursor-pointer transition-colors
        ${isCritical ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50' : 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50'}
      `}
    >
      <div className={`flex items-center justify-between text-[10px] mb-1 ${isCritical ? 'text-rose-400' : 'text-yellow-400'}`}>
        <span className="font-bold">{alert.time} — THREAT VALIDATED</span>
        <span className={`${isCritical ? 'bg-rose-500' : 'bg-yellow-500'} text-white px-1.5 rounded`}>Gemma 2B</span>
      </div>
      <div className={`leading-relaxed ${isCritical ? 'text-rose-200' : 'text-yellow-200'}`}>
        <strong>Alert:</strong> {alert.title} at {alert.location}
      </div>
    </motion.div>
  );
}
