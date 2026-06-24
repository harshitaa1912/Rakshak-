import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Admin Control Panel</h1>
      <div className="glass-card p-10 text-center text-stone-600">
        Admin features (Broadcasting alerts, managing shelters) require backend connection.
      </div>
    </div>
  );
};

export default AdminDashboard;
