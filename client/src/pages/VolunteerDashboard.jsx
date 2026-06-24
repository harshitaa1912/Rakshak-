import React from 'react';

const VolunteerDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Volunteer Command Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-emerald-600/30">
          <h3 className="text-stone-600 text-sm font-medium">Pending SOS Requests</h3>
          <p className="text-3xl font-bold text-stone-900 mt-2">0</p>
        </div>
        <div className="glass-card p-6 border-emerald-500/30">
          <h3 className="text-stone-600 text-sm font-medium">Your Active Missions</h3>
          <p className="text-3xl font-bold text-stone-900 mt-2">0</p>
        </div>
        <div className="glass-card p-6 border-blue-500/30">
          <h3 className="text-stone-600 text-sm font-medium">People Rescued</h3>
          <p className="text-3xl font-bold text-stone-900 mt-2">0</p>
        </div>
      </div>
      <div className="glass-card p-10 text-center text-stone-600">
        Connect backend API to load live volunteer missions.
      </div>
    </div>
  );
};

export default VolunteerDashboard;
