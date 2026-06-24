import React from 'react';

const ReportsPage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <h1 className="text-3xl font-bold text-stone-900 mb-4">Community Reports</h1>
      <p className="text-stone-600 mb-8">Crowdsourced real-time disaster information.</p>
      <div className="glass-card p-10 max-w-md mx-auto">
        <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">Module Coming Soon</h3>
        <p className="text-stone-600 text-sm">The reporting module is currently being connected to the backend APIs.</p>
      </div>
    </div>
  );
};

export default ReportsPage;
