import { Shield, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Active Cameras" 
        value="12 / 12" 
        icon={<Camera className="w-5 h-5" />} 
        trend="+2 this week"
        status="success"
        delay={0.1}
      />
      <StatCard 
        title="Threats Blocked" 
        value="47" 
        icon={<Shield className="w-5 h-5" />} 
        trend="Past 30 days"
        status="success"
        delay={0.2}
      />
      <StatCard 
        title="Alerts Today" 
        value="3" 
        icon={<AlertTriangle className="w-5 h-5" />} 
        trend="Requires review"
        status="warning"
        delay={0.3}
      />
      <StatCard 
        title="System Status" 
        value="Secure" 
        icon={<CheckCircle className="w-5 h-5" />} 
        trend="All nodes online"
        status="success"
        delay={0.4}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  status: 'success' | 'warning' | 'danger';
  delay: number;
}

function StatCard({ title, value, icon, trend, status, delay }: StatCardProps) {
  const statusColors = {
    success: 'text-primary-500 bg-primary-500/10',
    warning: 'text-yellow-500 bg-yellow-500/10',
    danger: 'text-accent-red bg-accent-red/10',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card-dark border border-card-border rounded-xl p-5 shadow-lg"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 font-medium text-sm">{title}</h3>
        <div className={`p-2 rounded-lg ${statusColors[status]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-slate-100">{value}</span>
      </div>
      <p className="text-xs text-slate-400">{trend}</p>
    </motion.div>
  );
}
