import React from 'react';
import { MapPin, Users, Phone, Coffee, PlusSquare, Info } from 'lucide-react';

const ShelterCard = ({ shelter, onClick }) => {
  const occupancyPercentage = Math.min(Math.round((shelter.currentOccupancy / shelter.capacity) * 100), 100);
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'full': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'closed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-stone-600 border-gray-500/50';
    }
  };

  const getCapacityColor = (percentage) => {
    if (percentage < 70) return 'bg-emerald-500';
    if (percentage < 95) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div 
      className="glass-card p-5 cursor-pointer hover:border-emerald-600/50 transition group"
      onClick={() => onClick && onClick(shelter)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition">{shelter.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border uppercase tracking-wider font-semibold ${getStatusColor(shelter.status)}`}>
          {shelter.status}
        </span>
      </div>

      <div className="flex items-start gap-2 text-stone-600 text-sm mb-4">
        <MapPin size={16} className="shrink-0 mt-0.5" />
        <span>{shelter.address}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-stone-600 mb-1">
          <span>Capacity: {shelter.currentOccupancy} / {shelter.capacity}</span>
          <span>{occupancyPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${getCapacityColor(occupancyPercentage)}`}
            style={{ width: `${occupancyPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-emerald-900/10">
        {shelter.foodAvailable && (
          <div className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-900/5 rounded text-stone-700" title="Food Available">
            <Coffee size={14} className="text-blue-400" /> Food
          </div>
        )}
        {shelter.medicalAvailable && (
          <div className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-900/5 rounded text-stone-700" title="Medical Support">
            <PlusSquare size={14} className="text-red-400" /> Medical
          </div>
        )}
        {shelter.waterAvailable && (
          <div className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-900/5 rounded text-stone-700" title="Drinking Water">
            <Info size={14} className="text-cyan-400" /> Water
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelterCard;
