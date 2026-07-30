import { useState } from 'react'
import { Layout } from '../components/Layout'
import { ShieldAlert, Search, Filter, Download, ChevronRight, Video } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function Incidents() {
  const [search, setSearch] = useState('')
  const { alerts } = useApp()

  const filteredAlerts = alerts.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.location.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toString().includes(search)
  )

  const handleExportCSV = () => {
    if (alerts.length === 0) return;
    
    const headers = ['Incident ID', 'Date', 'Time', 'Threat Level', 'Event Type', 'Source', 'AI Reasoning'];
    const rows = alerts.map(a => [
      `INC-${a.id.toString().slice(-4)}`,
      new Date().toLocaleDateString(),
      a.time,
      a.type,
      a.title,
      a.location,
      `"${(a.aiReasoning || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `security_incidents_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout headerTitle="Incident History">
      <div className="flex flex-col h-full space-y-6">
        
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800 shrink-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search incidents by ID, type, or camera..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-hidden bg-slate-900/30 border border-slate-800 rounded-xl flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wider bg-slate-900/50">
                  <th className="p-4 font-medium">Incident ID</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Threat Level</th>
                  <th className="p-4 font-medium">Event Type</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      No incidents found.
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((incident) => (
                    <tr key={incident.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer">
                      <td className="p-4 font-mono text-sm text-slate-300">INC-{incident.id.toString().slice(-4)}</td>
                      <td className="p-4">
                        <div className="text-sm text-slate-200">{new Date().toLocaleDateString()}</div>
                        <div className="text-xs text-slate-400 font-mono">{incident.time}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          incident.type === 'critical' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                          incident.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                          'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                          {incident.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-200 font-medium">{incident.title}</td>
                      <td className="p-4 text-sm text-slate-400 font-mono">{incident.location}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                          Investigating
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
            <span>Showing {filteredAlerts.length} total incidents</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-800 rounded hover:bg-slate-800 transition-colors opacity-50 cursor-not-allowed">Prev</button>
              <button className="px-3 py-1 border border-slate-800 rounded hover:bg-slate-800 transition-colors opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
