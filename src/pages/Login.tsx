import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, ChevronRight, Eye, Shield, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sixthsense.ai');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate a network request for the hackathon demo
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex text-slate-100 selection:bg-primary-500 selection:text-black">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10">
        
        {/* Brand Logo */}
        <Link to="/" className="absolute top-10 left-8 sm:left-16 md:left-24 xl:left-32 flex items-center gap-2 group">
          <div className="p-2 bg-primary-500/10 border border-primary-500/30 rounded-xl text-primary-400 group-hover:bg-primary-500/20 transition-colors">
            <Eye className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            Sixth Sense
          </span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">Access Console</h2>
            <p className="text-slate-400 text-sm md:text-base">Sign in to monitor your active AI defense network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-800 rounded-xl bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-800 rounded-xl bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-primary-500/20 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-primary-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090D16] focus:ring-primary-500 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-8"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Establishing Secure Connection...
                </span>
              ) : (
                <span className="flex items-center gap-2 group/btn">
                  Authenticate
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-xs text-slate-400">
            Protected by Sixth Sense Zero-Trust Architecture.
          </p>
        </motion.div>
      </div>

      {/* Right Column - Visual/Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 items-center justify-center p-12 overflow-hidden border-l border-slate-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent)] pointer-events-none"></div>
        
        {/* Abstract Tech Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg aspect-square"
        >
          {/* Main glowing orb */}
          <div className="absolute inset-0 rounded-full bg-primary-500/5 blur-3xl animate-pulse"></div>
          
          {/* Glassmorphic overlay card representing the AI */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-primary-900/20">
             <div className="w-24 h-24 mb-6 rounded-full border border-primary-500/30 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-2 rounded-full border-b-2 border-primary-400 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                <Shield className="w-8 h-8 text-primary-500 relative z-10" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Gemma Active</h3>
             <p className="text-slate-400 text-sm font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                System Ready
             </p>
          </div>

          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-0 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-xl flex items-center gap-3"
          >
            <div className="p-2 bg-rose-500/10 rounded-lg">
               <Activity className="w-4 h-4 text-rose-500" />
            </div>
            <div>
               <div className="text-[10px] text-slate-400 font-mono uppercase">Threat Prevented</div>
               <div className="text-xs font-bold text-white">02:14 AM - Zone 3</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-0 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-xl flex items-center gap-3"
          >
            <div className="p-2 bg-primary-500/10 rounded-lg">
               <Camera className="w-4 h-4 text-primary-500" />
            </div>
            <div>
               <div className="text-[10px] text-slate-400 font-mono uppercase">Active Streams</div>
               <div className="text-xs font-bold text-white">12/12 Cameras Online</div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
