import { Layout } from '../components/Layout';
import { Lock, Search, Filter, ShieldCheck, ShieldAlert, UserX, UserCheck, SmartphoneNfc } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function AccessLogs() {
  const { accessLogs, addAccessLog } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const filteredLogs = accessLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.door.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSimulateScan = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const isGranted = Math.random() > 0.3;
      const doors = ['Main Entrance', 'Server Room A', 'Loading Bay North', 'Executive Suite'];
      const users = ['Sarah Jenkins', 'Michael Chang', 'Unknown Individual', 'Emma Wilson', 'Contractor 04'];
      
      addAccessLog({
        id: `AC-${Math.floor(1000 + Math.random() * 9000)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: users[Math.floor(Math.random() * users.length)],
        role: isGranted ? 'Staff' : 'Unknown',
        door: doors[Math.floor(Math.random() * doors.length)],
        status: isGranted ? 'granted' : 'denied',
        method: Math.random() > 0.5 ? 'NFC Badge' : 'Biometric',
        timestamp: Date.now()
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <Layout headerTitle="Access Logs & Physical Security">
      <div className="h-full flex flex-col space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 rounded-xl p-2 w-full max-w-md">
            <Search className="w-5 h-5 text-slate-400 ml-2" />
            <input 
              type="text" 
              placeholder="Search by name, door, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-sm text-slate-200 focus:outline-none w-full placeholder-slate-600"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSimulateScan}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-blue-500/20"
            >
              <SmartphoneNfc className={`w-4 h-4 ${isSimulating ? 'animate-ping' : ''}`} /> 
              {isSimulating ? 'Scanning...' : 'Simulate Scan'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-300 transition-colors">
              <Filter className="w-4 h-4" /> Filter Logs
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                  <th className="px-6 py-4">Event ID</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Individual</th>
                  <th className="px-6 py-4">Access Point</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group animate-in fade-in slide-in-from-top-2 duration-300">
                    <td className="px-6 py-4 text-sm font-mono text-slate-400">{log.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">{log.time}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.status === 'granted' ? 'bg-primary-500/10 text-primary-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {log.status === 'granted' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-200">{log.user}</div>
                          <div className="text-xs text-slate-400">{log.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400" /> {log.door}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{log.method}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        log.status === 'granted' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.status === 'granted' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No access logs found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
