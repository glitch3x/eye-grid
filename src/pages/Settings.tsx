import { Layout } from '../components/Layout';
import { Settings2, Bell, Shield, Database, HardDrive, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings2 className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'storage', label: 'Storage', icon: <HardDrive className="w-4 h-4" /> },
  ];

  return (
    <Layout headerTitle="General Settings">
      <div className="h-full flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full overflow-hidden pb-4">
        
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-3xl p-8 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">System Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Facility Name</h4>
                      <p className="text-xs text-slate-400">The name displayed on the dashboard header.</p>
                    </div>
                    <input 
                      type="text" 
                      value={settings.facilityName}
                      onChange={(e) => updateSettings({ facilityName: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Timezone</h4>
                      <p className="text-xs text-slate-400">Used for incident logging and analytics.</p>
                    </div>
                    <select 
                      value={settings.timezone}
                      onChange={(e) => updateSettings({ timezone: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Auto-Siren (Critical Threats)</h4>
                      <p className="text-xs text-slate-400">Play an audible warning when a critical threat is validated.</p>
                    </div>
                    <div 
                      onClick={() => updateSettings({ enableAutoSiren: !settings.enableAutoSiren })}
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.enableAutoSiren ? 'bg-primary-600' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-slate-900 rounded-full transition-transform ${settings.enableAutoSiren ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Dark Mode</h4>
                      <p className="text-xs text-slate-400">Force dark mode across all interfaces.</p>
                    </div>
                    <div 
                      onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.darkMode ? 'bg-primary-600' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-slate-900 rounded-full transition-transform ${settings.darkMode ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Alert Routing</h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">SMS Alerts (Critical Only)</h4>
                        <p className="text-xs text-slate-400">+1 (555) 019-2834</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-primary-400">Edit</button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">Webhook Integration</h4>
                        <p className="text-xs text-slate-400">Not configured</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-slate-400">Setup</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {(activeTab === 'security' || activeTab === 'storage') && (
            <div className="h-full flex items-center justify-center text-slate-400 animate-in fade-in duration-500">
               Settings category under construction for the Hackathon Demo.
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
