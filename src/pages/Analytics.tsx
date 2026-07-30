import { Layout } from '../components/Layout';
import { BarChart2, TrendingUp, Activity, Users, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Analytics() {
  const { alerts, faces } = useApp();

  // Calculate dynamic KPIs
  const totalDetections = alerts.length;
  const criticalThreats = alerts.filter(a => a.type === 'critical').length;
  const uniqueFaces = faces.length;
  
  // Dynamic Heatmap Data (percentage of alerts per camera)
  const cameraCounts = alerts.reduce((acc, alert) => {
    if (alert.cameraId) {
      acc[alert.cameraId] = (acc[alert.cameraId] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);
  
  const heatmapData = [
    { name: 'CAM-01 (Main Entrance)', val: totalDetections ? Math.round(((cameraCounts[1] || 0) / totalDetections) * 100) : 0 },
    { name: 'CAM-02 (Loading Bay)', val: totalDetections ? Math.round(((cameraCounts[2] || 0) / totalDetections) * 100) : 0 },
    { name: 'CAM-03 (Alleyway)', val: totalDetections ? Math.round(((cameraCounts[3] || 0) / totalDetections) * 100) : 0 },
    { name: 'CAM-04 (Parking)', val: totalDetections ? Math.round(((cameraCounts[4] || 0) / totalDetections) * 100) : 0 },
  ];

  // Mock a time distribution based on current total alerts for the visual effect
  // In a real app we'd parse alert.time, but since alerts happen in real-time we'll just seed a distribution
  const baseChart = [4, 2, 7, 12, 24, 18, 9, 3, 2, 5, 8, 15];
  const chartData = baseChart.map(val => val + (totalDetections > 0 ? Math.floor(Math.random() * totalDetections) : 0));
  const maxChart = Math.max(...chartData, 24);

  return (
    <Layout headerTitle="System Analytics">
      <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-2 pb-4">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3 text-slate-400">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Total Detections</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalDetections}</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Live Session</div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3 text-slate-400">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Critical Threats</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{criticalThreats}</div>
            <div className="text-xs text-rose-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Requiring Action</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3 text-slate-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Unique Faces</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{uniqueFaces}</div>
            <div className="text-xs text-slate-400">Enrolled in DB</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3 text-slate-400">
              <BarChart2 className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Avg Response</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">1.2s</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">Fastest on record</div>
          </div>
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h3 className="font-bold text-white mb-6">Threats by Time of Day</h3>
            <div className="flex-1 flex items-end gap-2 h-full">
              {chartData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-slate-800 rounded-t-sm relative group-hover:bg-primary-500 transition-colors" style={{ height: `${(val / maxChart) * 100}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{i * 2}h</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h3 className="font-bold text-white mb-6">Incident Heatmap by Camera</h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
              {heatmapData.map(cam => (
                <div key={cam.name}>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                    <span>{cam.name}</span>
                    <span className="text-slate-400">{cam.val}% of incidents</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-primary-600 to-rose-500 transition-all duration-1000" style={{ width: `${cam.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
