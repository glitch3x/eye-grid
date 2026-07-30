import { Link } from 'react-router-dom';
import { Eye, Zap, ArrowRight, Play, Camera, Cpu, BellRing, CheckCircle2, Shield } from 'lucide-react';


export function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#090D16] text-slate-100 selection:bg-primary-500 selection:text-black">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.15),rgba(255,255,255,0))] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-[#090D16]/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500/10 border border-primary-500/30 rounded-xl text-primary-400">
              <Eye className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              Eye Grid
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm text-slate-400 font-medium">
            <a href="#features" className="hover:text-primary-400 transition-colors">Features</a>
            <a href="#architecture" className="hover:text-primary-400 transition-colors">Architecture</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all hover:scale-[1.02]">
              Launch Console
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Zap className="w-3.5 h-3.5" />
          <span>Gemma AI-Powered Monitoring-as-a-Service</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Turn Reactive Cameras into <br />
          <span className="bg-gradient-to-r from-primary-400 via-green-300 to-primary-500 bg-clip-text text-transparent">
            Active Threat Defense
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Eye Grid brings low-latency, multimodal vision intelligence to your existing IP streams using the power of Gemma.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/login" className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all flex items-center justify-center space-x-2">
            <span>Connect Your Cameras</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2">
            <Play className="w-4 h-4 fill-current" />
            <span>Watch Live Demo</span>
          </button>
        </div>

        {/* Dashboard Preview / Interface Demo */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-950/60 p-4 backdrop-blur-xl shadow-2xl shadow-primary-950/50">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 px-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs text-slate-400 font-mono ml-2">Console v1.0.4 — Live Monitor</span>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemma Engine: Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Camera Feed View */}
            <div className="md:col-span-2 relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group">
              <img 
                src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80" 
                alt="Camera Feed" 
                className="w-full h-full object-cover opacity-60"
              />
              
              {/* Overlay Mock Bounding Box */}
              <div className="absolute top-[25%] left-[35%] w-[30%] h-[55%] border-2 border-rose-500 bg-rose-500/10 rounded-lg backdrop-blur-[1px] flex flex-col justify-between p-2">
                <span className="bg-rose-500 text-white text-[10px] font-mono px-1.5 py-0.5 rounded w-fit font-bold">
                  THREAT DETECTED (94.2%)
                </span>
                <span className="text-[10px] font-mono text-rose-300 bg-slate-950/80 px-1 py-0.5 rounded text-left">
                  Unregistered Access after hours
                </span>
              </div>

              {/* Feed Meta */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
                CAM_02 — BACK DOCK LOADING BAY
              </div>
            </div>

            {/* AI Decision Stream */}
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 text-left font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px] mb-3 font-semibold">
                  Real-time Inference Log
                </div>
                <div className="space-y-3">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">02:14:01</span>
                    <p className="text-slate-300 mt-1">YOLOv8: Motion trigger registered in Zone 2.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
                    <span className="text-rose-400">02:14:02</span>
                    <p className="text-rose-200 mt-1">
                      <strong>PaliGemma Vision:</strong> Subject attempting physical door bypass. Confidence high.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-primary-500/10 border border-primary-500/30">
                    <span className="text-primary-400">02:14:03</span>
                    <p className="text-primary-200 mt-1">Dispatching SMS alert to site owner & sounding on-site chime.</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white font-sans font-semibold py-2 rounded-lg transition-colors">
                Escalate Incident Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section id="features" className="py-20 px-6 border-t border-slate-800/80 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Proactive Security, Built for SMEs
          </h2>
          <p className="text-slate-400">
            Deploy advanced AI without specialized hardware. Eye Grid works over your current IP setup via lightweight local AI processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-primary-500/40 transition-all">
            <div className="p-3 bg-primary-500/10 border border-primary-500/30 w-fit rounded-xl text-primary-400 mb-6">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Zero Hardware Overhaul</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connect existing IP cameras seamlessly using standard RTSP streams or a simple plug-and-play local edge hub.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-primary-500/40 transition-all">
            <div className="p-3 bg-primary-500/10 border border-primary-500/30 w-fit rounded-xl text-primary-400 mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gemma Multimodal AI</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Uses lightweight quantized Gemma vision models to accurately validate threats zero-shot—cutting false alerts down to near zero.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-primary-500/40 transition-all">
            <div className="p-3 bg-primary-500/10 border border-primary-500/30 w-fit rounded-xl text-primary-400 mb-6">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Dispatch</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Receive verified push notifications within 2 seconds. Directly trigger automated alarms or alert rapid dispatch teams.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
              How Eye Grid Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A lightweight, highly scalable architecture designed to run efficiently on edge devices or in the cloud.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 via-primary-500/50 to-slate-800 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center shadow-xl">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <Camera className="w-6 h-6 text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">1. Existing IP Streams</h4>
                <p className="text-sm text-slate-400">
                  Connects to any standard RTSP/ONVIF camera feed. No proprietary hardware required.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900 border border-primary-500/30 p-6 rounded-2xl text-center shadow-xl shadow-primary-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-500/5 pointer-events-none"></div>
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-500/50">
                  <Cpu className="w-6 h-6 text-primary-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">2. Vision AI Inference</h4>
                <p className="text-sm text-slate-400">
                  Frames are analyzed in real-time by the multimodal Gemma model to detect complex threats contextually.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center shadow-xl">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <Zap className="w-6 h-6 text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">3. Instant Response</h4>
                <p className="text-sm text-slate-400">
                  Trigger webhooks, push notifications, and visual dashboard alerts within milliseconds of a verified threat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Target Industries */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Securing Every Environment
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From tight retail spaces to sprawling construction sites, our multimodal AI adapts to your specific security needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Retail Stores", desc: "Detect shoplifting and off-hours intrusion.", icon: <CheckCircle2 className="w-5 h-5 text-primary-400" /> },
            { title: "Warehouses", desc: "Monitor loading docks and unauthorized access.", icon: <CheckCircle2 className="w-5 h-5 text-primary-400" /> },
            { title: "Construction", desc: "Protect valuable equipment from overnight theft.", icon: <CheckCircle2 className="w-5 h-5 text-primary-400" /> },
            { title: "Real Estate", desc: "Secure vacant properties and construction sites.", icon: <CheckCircle2 className="w-5 h-5 text-primary-400" /> },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:bg-slate-900/60 transition-colors">
              <div className="mb-4">{item.icon}</div>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-500/20 to-slate-900 border border-primary-500/30 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent)] pointer-events-none"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
            Ready to upgrade your security?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
            Join the beta today and transform your existing camera network into a proactive AI defense system in under 5 minutes.
          </p>
          <Link to="/login" className="inline-flex items-center space-x-2 bg-primary-500 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:scale-105 transition-all relative z-10">
            <span>Start Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 text-center text-sm text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-primary-400" />
            <span className="font-bold text-white">Eye Grid</span>
          </div>
          <p>© 2026 Eye Grid Technologies Inc. Built for Gemma AI Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}
