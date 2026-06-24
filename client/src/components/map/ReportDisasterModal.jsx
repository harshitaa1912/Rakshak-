import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, MapPin, Loader } from 'lucide-react';
import api from '../../services/api';

const REPORT_TYPES = [
  'road-blocked',
  'bridge-collapsed',
  'flood',
  'power-outage',
  'building-damage',
  'fire',
  'landslide',
  'other'
];

const ReportDisasterModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    reportType: 'flood',
    severity: 'medium',
    description: '',
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({ reportType: 'flood', severity: 'medium', description: '' });
      setLocation(null);
      setError('');
      getLocation();
    }
  }, [isOpen]);

  const getLocation = () => {
    setLocating(true);
    setError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude]
          });
          setLocating(false);
        },
        (err) => {
          console.error(err);
          setError('Could not get your location. Please ensure location services are enabled.');
          setLocating(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError('Location is required to report a disaster.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/reports', {
        ...formData,
        location
      });
      setLoading(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-500 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">Report Disaster</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Disaster Type</label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition capitalize"
            >
              {REPORT_TYPES.map(type => (
                <option key={type} value={type}>{type.replace('-', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Severity</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition capitalize"
            >
              <option value="low">Low - Monitor Situation</option>
              <option value="medium">Medium - Causes Disruption</option>
              <option value="high">High - Dangerous</option>
              <option value="critical">Critical - Life Threatening</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Provide details about the incident..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
            />
          </div>

          <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
            <div className="mt-0.5 text-orange-500">
              {locating ? <Loader size={20} className="animate-spin" /> : <MapPin size={20} />}
            </div>
            <div>
              <p className="text-sm font-medium text-stone-800">Location Tagging</p>
              <p className="text-xs text-stone-500 mt-1">
                {locating ? 'Acquiring GPS coordinates...' : location ? 'Location acquired successfully.' : 'Location required to report.'}
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || locating || !location}
              className="flex-1 py-3 font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportDisasterModal;
