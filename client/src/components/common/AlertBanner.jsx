import React, { useState } from 'react';
import { AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

const AlertBanner = ({ alert, dismissible = true }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!alert || dismissed) return null;

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/50',
          text: 'text-red-200',
          icon: <AlertOctagon className="text-red-400 animate-pulse" />,
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
        };
      case 'high':
        return {
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/50',
          text: 'text-amber-200',
          icon: <AlertTriangle className="text-amber-400" />,
          glow: 'shadow-[0_0_10px_rgba(245,158,11,0.2)]'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-200',
          icon: <AlertTriangle className="text-yellow-400" />,
          glow: ''
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-200',
          icon: <Info className="text-blue-400" />,
          glow: ''
        };
    }
  };

  const style = getSeverityStyles(alert.severity);

  return (
    <div className={`relative overflow-hidden rounded-xl border ${style.bg} ${style.border} p-4 flex items-start gap-3 ${style.glow} animate-slide-up mb-6`}>
      <div className="mt-0.5">{style.icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold text-stone-900 flex items-center gap-2">
          {alert.title}
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 border border-emerald-900/10 uppercase tracking-wider">
            {alert.disasterType}
          </span>
        </h4>
        <p className={`text-sm mt-1 ${style.text}`}>{alert.message}</p>
        <p className="text-xs text-stone-900/50 mt-2">Area: {alert.area}</p>
      </div>
      {dismissible && (
        <button 
          onClick={() => setDismissed(true)}
          className="text-stone-900/50 hover:text-stone-900 transition"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
