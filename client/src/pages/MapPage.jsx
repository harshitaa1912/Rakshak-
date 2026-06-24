import React, { useState, useEffect } from 'react';
import DisasterMap from '../components/map/DisasterMap';
import api from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import { Filter, Layers } from 'lucide-react';

const MapPage = () => {
  const [shelters, setShelters] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { latestSOS } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sheltersRes, sosRes, reportsRes] = await Promise.all([
          api.get('/shelters'),
          api.get('/sos'),
          api.get('/reports')
        ]);
        setShelters(sheltersRes.data || []);
        setSosRequests(sosRes.data || []);
        setReports(reportsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch map data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update when socket emits new SOS
  useEffect(() => {
    if (latestSOS) {
      setSosRequests(prev => {
        // Replace if exists, else add
        const exists = prev.some(s => s._id === latestSOS._id);
        if (exists) {
          return prev.map(s => s._id === latestSOS._id ? latestSOS : s);
        }
        return [latestSOS, ...prev];
      });
    }
  }, [latestSOS]);

  const handleMarkerClick = (marker) => {
    console.log("Marker clicked:", marker);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] relative">
      <div className="absolute top-4 right-4 z-20 glass-card p-4 space-y-4 w-64 bg-white/90 shadow-xl shadow-emerald-900/10">
        <h3 className="font-semibold text-stone-900 flex items-center gap-2 border-b border-emerald-900/10 pb-2">
          <Layers size={18} /> Map Layers
        </h3>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 text-stone-700">
            <input type="checkbox" defaultChecked className="accent-emerald-600 rounded" /> 
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Safe Shelters
          </label>
          <label className="flex items-center gap-2 text-stone-700">
            <input type="checkbox" defaultChecked className="accent-red-500 rounded" /> 
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse"></span> Active SOS
          </label>
          <label className="flex items-center gap-2 text-stone-700">
            <input type="checkbox" defaultChecked className="accent-orange-500 rounded" /> 
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> Danger Zones
          </label>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden glass-card p-1">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-white/60">
            <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <DisasterMap 
            shelters={shelters} 
            sosRequests={sosRequests} 
            reports={reports}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </div>
    </div>
  );
};

export default MapPage;
