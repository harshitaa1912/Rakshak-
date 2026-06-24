import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', trend }) => {
  const colorMap = {
    indigo: 'text-emerald-700 bg-indigo-400/10 border-emerald-600/20',
    red: 'text-red-400 bg-red-400/10 border-red-500/20',
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass-card p-5 relative overflow-hidden group hover:border-emerald-900/10 transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-stone-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-stone-900">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend} this week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${style}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Decorative gradient blob */}
      <div className={`absolute -bottom-10 -right-10 w-24 h-24 blur-3xl opacity-20 rounded-full bg-${color}-500 transition-opacity group-hover:opacity-40`}></div>
    </div>
  );
};

export default StatCard;
