import { Layout } from '../components/Layout';
import { Users, UserPlus, Shield, ScanFace, CheckCircle2, Camera } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function FacialRecognition() {
  const { faces, addFace } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isAdding) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(err => console.error("Error accessing webcam:", err));
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isAdding]);

  const handleAddFace = () => {
    if (newName && newRole && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        
        addFace({
          id: Date.now(),
          name: newName,
          role: newRole,
          image: base64Image,
          status: 'active'
        });
        
        setIsAdding(false);
        setNewName('');
        setNewRole('');
      }
    }
  };

  return (
    <Layout headerTitle="Facial Recognition Database">
      <div className="h-full flex flex-col space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Known Individuals</h2>
            <p className="text-sm text-slate-400">Manage the biometric database for automated access control and threat detection.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-primary-500/20"
          >
            <UserPlus className="w-4 h-4" /> Add New Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 overflow-y-auto pr-2 pb-4">
          {faces.map(face => (
            <div key={face.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden group hover:border-primary-500/50 transition-all">
              <div className="aspect-square relative overflow-hidden bg-slate-950">
                <img src={face.image} alt={face.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono flex items-center gap-1.5 uppercase">
                  <CheckCircle2 className="w-3 h-3" /> {face.status}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-200 text-lg truncate">{face.name}</h3>
                <p className="text-primary-400 text-sm font-medium mb-4 truncate">{face.role}</p>
                <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ScanFace className="w-4 h-4" /> 99.8% Match Rate
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors text-xs font-medium">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#090D16] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-xl text-white mb-2">Enroll New Profile</h3>
            <p className="text-sm text-slate-400 mb-6">Position face in the frame to generate a biometric signature.</p>
            
            <div className="aspect-square bg-slate-950 rounded-xl mb-6 relative overflow-hidden border border-slate-800">
              <video 
                ref={videoRef}
                autoPlay playsInline muted
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-primary-500/50 m-12 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
              </div>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Full Name</label>
                <input 
                  type="text" 
                  value={newName} onChange={e => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Role / Clearance Level</label>
                <input 
                  type="text" 
                  value={newRole} onChange={e => setNewRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500"
                  placeholder="e.g. IT Administrator"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-300 transition-colors">Cancel</button>
              <button 
                onClick={handleAddFace}
                disabled={!newName || !newRole || !stream}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:hover:bg-primary-600 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-primary-500/20"
              >
                <Camera className="w-4 h-4" /> Capture & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
