import React, { useState, useEffect } from 'react';
import SOSButton from '../components/sos/SOSButton';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Clock, CheckCircle, User } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SOSPage = () => {
  const { user } = useAuth();
  const { latestSOS } = useSocket();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMySOS = async () => {
      try {
        const res = await api.get('/sos/my');
        setRequests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch SOS", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMySOS();
  }, []);

  // Update requests if the socket emits an update for our SOS
  useEffect(() => {
    if (latestSOS && latestSOS.userId?._id === user?._id) {
      setRequests(prev => {
        const exists = prev.some(s => s._id === latestSOS._id);
        if (exists) {
          return prev.map(s => s._id === latestSOS._id ? latestSOS : s);
        }
        return [latestSOS, ...prev];
      });
    }
  }, [latestSOS, user?._id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 border border-red-200">Pending Rescue</span>;
      case 'assigned': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-600 border border-amber-200">Volunteer Assigned</span>;
      case 'in-progress': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600 border border-blue-200">Rescue in Progress</span>;
      case 'resolved': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 border border-emerald-200">Resolved</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Emergency Management</h1>
        <p className="text-stone-600">Request immediate assistance or track your active emergency signals.</p>
        <div className="mt-8">
          <SOSButton />
        </div>
      </div>

      <div className="glass-card overflow-hidden bg-white">
        <div className="p-5 border-b border-stone-200 bg-stone-50">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Clock className="text-emerald-700" size={20} /> Your SOS History
          </h2>
        </div>
        
        <div className="p-0">
          {loading ? (
            <LoadingSpinner />
          ) : requests.length === 0 ? (
            <div className="p-10 text-center text-stone-500">
              <CheckCircle size={48} className="mx-auto mb-4 text-emerald-300" />
              <p>You have no active emergency requests.</p>
              <p className="text-sm mt-2">Only use the SOS button in genuine emergencies.</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-200">
              {requests.map((req) => (
                <li key={req._id} className="p-5 hover:bg-stone-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-stone-900 uppercase tracking-wider text-sm">{req.emergencyType} Emergency</span>
                        {getStatusBadge(req.status)}
                      </div>
                      <p className="text-sm text-stone-600 mb-2">
                        <span className="font-medium text-stone-800">Requested:</span> {new Date(req.createdAt).toLocaleString()}
                      </p>
                      {req.description && (
                        <p className="text-sm text-stone-700 bg-stone-100 p-3 rounded-lg border border-stone-200">
                          "{req.description}"
                        </p>
                      )}
                    </div>
                    
                    {req.assignedVolunteer && (
                      <div className="shrink-0 bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <User size={20} className="text-emerald-700" />
                        </div>
                        <div>
                          <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">Assigned Responder</p>
                          <p className="text-emerald-900 font-medium">{req.assignedVolunteer.name || 'Volunteer'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOSPage;
