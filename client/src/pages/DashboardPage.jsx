import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import StatCard from '../components/common/StatCard';
import AlertBanner from '../components/common/AlertBanner';
import { Shield, Bell, Navigation, HeartPulse, ShieldCheck, Home, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ReportDisasterModal from '../components/map/ReportDisasterModal';
import api from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const { latestAlert } = useSocket();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSafe, setIsSafe] = useState(user?.isSafe || false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats');
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
        // Fallback zeroes if not admin
        setStats({ activeAlerts: 0, pendingSOS: 0, totalShelters: 0, totalVolunteers: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const markSafe = async () => {
    try {
      await api.post('/users/mark-safe');
      setIsSafe(true);
      alert('You have been marked as SAFE. The network has been updated.');
    } catch (error) {
      console.error("Failed to mark safe", error);
      alert('Error marking safe. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Welcome back, <span className="capitalize">{user?.name}</span></h1>
          <p className="text-stone-600 text-sm mt-1">DisasterGuard network is monitoring your area.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsReportModalOpen(true)} 
            className="px-4 py-2 font-medium rounded-lg transition flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20"
          >
            <AlertTriangle size={18} /> Report Disaster
          </button>
          <button 
            onClick={markSafe} 
            disabled={isSafe}
            className={`px-4 py-2 font-medium rounded-lg transition flex items-center gap-2 ${
              isSafe 
                ? 'bg-emerald-900/50 text-emerald-500 border border-emerald-800 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
            }`}
          >
            <ShieldCheck size={18} /> {isSafe ? 'Marked Safe' : 'Mark as Safe'}
          </button>
        </div>
      </div>

      <ReportDisasterModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        onSuccess={() => {
          setIsReportModalOpen(false);
          alert('Disaster report submitted successfully! It will now appear on the map.');
        }} 
      />

      {latestAlert && <AlertBanner alert={latestAlert} />}
      {!latestAlert && (
        <AlertBanner 
          alert={{ 
            title: 'Monitoring Active', 
            severity: 'low', 
            disasterType: 'Status Normal', 
            message: 'All systems operational. Network is actively monitoring local sensors and weather data.', 
            area: 'Local Region' 
          }} 
          dismissible={false} 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Alerts" value={stats?.activeAlerts || 0} icon={Bell} color="amber" />
        <StatCard title="Pending SOS" value={stats?.pendingSOS || 0} icon={HeartPulse} color="red" />
        <StatCard title="Safe Shelters" value={stats?.totalShelters || 0} icon={Home} color="emerald" />
        <StatCard title="Volunteers Active" value={stats?.totalVolunteers || 0} icon={Shield} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 bg-white">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/sos" className="p-4 rounded-xl border border-red-500/30 bg-red-50 hover:bg-red-100 text-center transition group">
              <HeartPulse size={24} className="text-red-500 mx-auto mb-2 group-hover:scale-110 transition" />
              <span className="text-red-700 font-medium">Send SOS</span>
            </a>
            <a href="/map" className="p-4 rounded-xl border border-blue-500/30 bg-blue-50 hover:bg-blue-100 text-center transition group">
              <Navigation size={24} className="text-blue-500 mx-auto mb-2 group-hover:scale-110 transition" />
              <span className="text-blue-700 font-medium">Live Map</span>
            </a>
            <a href="/shelters" className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 text-center transition group">
              <Home size={24} className="text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition" />
              <span className="text-emerald-700 font-medium">Find Shelter</span>
            </a>
            <a href="/reports" className="p-4 rounded-xl border border-purple-500/30 bg-purple-50 hover:bg-purple-100 text-center transition group">
              <Shield size={24} className="text-purple-500 mx-auto mb-2 group-hover:scale-110 transition" />
              <span className="text-purple-700 font-medium">Report Incident</span>
            </a>
          </div>
        </div>

        <div className="glass-card p-6 bg-white">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {isSafe && (
               <div className="flex items-start gap-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
               <div className="p-2 rounded-full bg-emerald-100 text-emerald-600"><ShieldCheck size={16} /></div>
               <div>
                 <p className="text-sm text-emerald-900">You marked yourself as safe</p>
                 <p className="text-xs text-emerald-600">Recently</p>
               </div>
             </div>
            )}
            <div className="flex items-start gap-4 p-3 rounded-lg bg-stone-50">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600"><Navigation size={16} /></div>
              <div>
                <p className="text-sm text-stone-800">You logged into the network safely</p>
                <p className="text-xs text-stone-500">Recently</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
