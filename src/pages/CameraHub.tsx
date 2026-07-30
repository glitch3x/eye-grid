import { Layout } from '../components/Layout';
import { Plus, Video, Settings2, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function CameraHub() {
  const { cameras, addCamera } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [newCameraName, setNewCameraName] = useState('');
  const [newCameraUrl, setNewCameraUrl] = useState('');

  const handleConnectSelected = async () => {
    if (newCameraName && newCameraUrl) {
      await addCamera({ name: newCameraName, url: newCameraUrl } as any);
      setIsScanning(false);
      setNewCameraName('');
      setNewCameraUrl('');
    }
  };

  return (
    <Layout headerTitle="Camera Configuration Hub">
      <div className="h-full flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Device Management</h2>
            <p className="text-sm text-slate-400">Configure IP cameras, manage RTSP streams, and monitor connection health.</p>
          </div>
          <button 
            onClick={() => setIsScanning(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-4 h-4" /> Add Camera Feed
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2 pb-4">
          {cameras.map((cam, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 group hover:border-primary-500/50 transition-all flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200">{cam.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${cam.status === 'online' ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                      <span className="text-xs font-mono text-slate-400 uppercase">{cam.id}</span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Protocol</div>
                  <div className="text-sm text-slate-300 font-mono">{cam.protocol || 'RTSP'}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Stream URL</div>
                  <div className="text-sm text-slate-300 font-mono truncate">{cam.url || 'Not configured'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isScanning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl text-white">Add New Camera</h3>
                <p className="text-sm text-slate-400 mt-1">Configure an RTSP stream or MP4 fallback for the NVR.</p>
              </div>
              <button onClick={() => setIsScanning(false)} className="text-slate-500 hover:text-white transition-colors p-2"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Camera Name</label>
                <input 
                  type="text" 
                  value={newCameraName}
                  onChange={e => setNewCameraName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500"
                  placeholder="e.g. Lobby Entrance"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Stream URL</label>
                <input 
                  type="text" 
                  value={newCameraUrl}
                  onChange={e => setNewCameraUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 font-mono"
                  placeholder="e.g. rtsp://192.168.1.100/stream or ./demo.mp4"
                />
                <p className="text-xs text-slate-500 mt-2">To use an MP4 file for demonstration, place the file in the `server` directory and enter `./filename.mp4`.</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
              <button onClick={() => setIsScanning(false)} className="px-5 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-300 transition-colors">Cancel</button>
              <button 
                onClick={handleConnectSelected}
                disabled={!newCameraName || !newCameraUrl}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:hover:bg-primary-600 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-primary-500/20"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
