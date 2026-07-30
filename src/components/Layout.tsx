import type { ReactNode } from 'react';
import { Eye, LayoutGrid, ShieldAlert, Camera, Sliders, Clock, Siren, Lock, Users, BarChart2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  headerTitle?: string;
  headerRight?: ReactNode;
}

export function Layout({ children, headerTitle = 'Live Command Console', headerRight }: LayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070A10] text-slate-100 font-sans selection:bg-primary-500/30">
      
      {/* Left Sidebar Navigation */}
      <aside className="w-20 lg:w-64 border-r border-slate-800/80 bg-[#090D16] flex flex-col justify-between p-4 z-20 shrink-0 transition-all">
        <div className="space-y-8">
          {/* Brand Header */}
          <Link to="/" className="flex items-center space-x-3 px-2 group">
            <div className="p-2 bg-primary-500/10 border border-primary-500/30 rounded-xl text-primary-400 group-hover:bg-primary-500/20 transition-colors">
              <Eye className="w-6 h-6" />
            </div>
            <div className="hidden lg:block">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent block group-hover:opacity-80 transition-opacity">
                Eye Grid
              </span>
              <span className="text-[10px] text-slate-400 font-mono">v1.0.4 EDGE OS</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <NavItem to="/dashboard" icon={<LayoutGrid className="w-5 h-5" />} label="Live Monitor" end />
            <NavItem to="/dashboard/incidents" icon={<ShieldAlert className="w-5 h-5" />} label="Incidents" badge={3} />
            <NavItem to="/dashboard/cameras" icon={<Camera className="w-5 h-5" />} label="Camera Hub" />
            <NavItem to="/dashboard/config" icon={<Sliders className="w-5 h-5" />} label="Model Config" />
            
            <div className="pt-4 pb-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-600 uppercase">Enterprise Features</p>
            </div>
            <NavItem to="/dashboard/access" icon={<Lock className="w-5 h-5" />} label="Access Logs" />
            <NavItem to="/dashboard/faces" icon={<Users className="w-5 h-5" />} label="Facial Recognition" />
            <NavItem to="/dashboard/analytics" icon={<BarChart2 className="w-5 h-5" />} label="Analytics" />
            
            <div className="pt-4 pb-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-600 uppercase">System</p>
            </div>
            <NavItem to="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="General Settings" />
          </nav>
        </div>

        {/* User Profile & Edge Node Status */}
        <div className="space-y-4">
          <div className="hidden lg:block p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-mono">Edge Node #01</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono truncate">Gemma-2B Quantized (4-bit)</div>
          </div>

          <div className="flex items-center space-x-3 px-2 border-t border-slate-800/80 pt-4">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-primary-500/20 border border-primary-500/40 flex items-center justify-center font-bold text-primary-400 text-xs">
              ME
            </div>
            <div className="hidden lg:block overflow-hidden">
              <div className="text-sm font-medium text-slate-200 truncate">Main Office Site</div>
              <div className="text-xs text-slate-400 truncate">Pro Plan (4/4 Cams)</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Console Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#070A10]">
        
        {/* Top Bar Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#090D16]/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-white tracking-tight">{headerTitle}</h1>
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>System Guarded</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {headerRight}
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>

    </div>
  );
}

import { NavLink } from 'react-router-dom';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  end?: boolean;
  badge?: number;
}

function NavItem({ icon, label, to, end, badge }: NavItemProps) {
  return (
    <NavLink 
      to={to}
      end={end}
      className={({ isActive }) => `
        w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
        ${isActive 
          ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30' 
          : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
        }
      `}
    >
      <div className="shrink-0">{icon}</div>
      <span className="hidden lg:inline flex-1 text-left">{label}</span>
      {badge && (
        <span className="hidden lg:inline-block ml-auto bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded-full font-mono">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
