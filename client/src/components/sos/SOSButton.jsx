import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';

const SOSButton = () => {
  const { isAuthenticated, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [emergencyType, setEmergencyType] = useState('rescue');
  const [description, setDescription] = useState('');
  
  const handleSOSClick = () => {
    if (!isAuthenticated) {
      alert("Please login or register to use the SOS feature so responders know who to help.");
      return;
    }
    setIsModalOpen(true);
    setSuccess(false);
  };

  const submitSOS = async () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await api.post('/sos', {
              emergencyType,
              description,
              location: {
                type: 'Point',
                coordinates: [position.coords.longitude, position.coords.latitude]
              }
            });
            
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
              setIsModalOpen(false);
            }, 2000);
          } catch (error) {
            console.error("Failed to submit SOS", error);
            alert("Failed to submit SOS. Please try again.");
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Please enable location services so rescuers can find you.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSOSClick}
        className="relative group flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-red-600 border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:shadow-[0_0_50px_rgba(239,68,68,0.9)] hover:bg-red-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50 mx-auto animate-pulse-sos"
      >
        <AlertTriangle size={36} className="text-white mb-1 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-white font-black text-xl md:text-2xl tracking-widest">SOS</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => !loading && setIsModalOpen(false)} title="Broadcast Emergency SOS">
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">SOS Broadcasted!</h3>
            <p className="text-stone-600">Your location and details have been sent to nearby volunteers and authorities. Please stay safe.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-800">
              <AlertTriangle className="shrink-0 text-red-600" size={20} />
              <p className="text-sm font-medium">This will instantly transmit your exact GPS coordinates to emergency responders. Do not abuse this feature.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">What kind of emergency?</label>
              <select 
                className="w-full bg-white border border-stone-200 rounded-lg p-3 text-stone-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                disabled={loading}
              >
                <option value="rescue">Trapped / Need Rescue</option>
                <option value="medical">Medical Emergency</option>
                <option value="food">Need Food/Water</option>
                <option value="shelter">Need Shelter</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Additional Details (Optional)</label>
              <textarea 
                className="w-full bg-white border border-stone-200 rounded-lg p-3 text-stone-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 h-24 resize-none"
                placeholder="E.g., 3 people injured, water rising..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              ></textarea>
            </div>

            <button 
              onClick={submitSOS}
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-white text-md transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Transmitting GPS Data...</>
              ) : (
                <><MapPin size={20} /> SEND SOS NOW</>
              )}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default SOSButton;
