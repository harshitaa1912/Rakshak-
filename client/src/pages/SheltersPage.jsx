import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ShelterCard from '../components/shelters/ShelterCard';
import { Search, Filter } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';

const SheltersPage = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedShelter, setSelectedShelter] = useState(null);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await api.get('/shelters');
        setShelters(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, []);

  const filteredShelters = shelters.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Safe Shelters & Relief Camps</h1>
          <p className="text-stone-600 text-sm mt-1">Find verified locations for safety, food, and medical support.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or area..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-stone-200 rounded-lg py-2 pl-10 pr-4 text-stone-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none w-full md:w-64 transition text-sm"
            />
          </div>
          <button className="px-4 py-2 glass-card bg-white rounded-lg flex items-center gap-2 hover:bg-stone-50 transition border border-stone-200 text-stone-700 text-sm">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredShelters.length === 0 ? (
        <div className="text-center py-20 glass-card bg-white">
          <p className="text-stone-500">No shelters found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelters.map(shelter => (
            <ShelterCard 
              key={shelter._id} 
              shelter={shelter} 
              onClick={() => setSelectedShelter(shelter)}
            />
          ))}
        </div>
      )}

      {/* Shelter Detail Modal */}
      <Modal isOpen={!!selectedShelter} onClose={() => setSelectedShelter(null)} title="Shelter Details">
        {selectedShelter && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">{selectedShelter.name}</h2>
              <p className="text-stone-600">{selectedShelter.address}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Capacity</p>
                <p className="text-xl font-bold text-stone-900">{selectedShelter.currentOccupancy} / {selectedShelter.capacity}</p>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                <p className="text-xl font-bold text-stone-900 capitalize">{selectedShelter.status}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200 pb-2">Amenities</h4>
              <ul className="grid grid-cols-2 gap-2 text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${selectedShelter.foodAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  Food Distribution
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${selectedShelter.medicalAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  Medical Support
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${selectedShelter.waterAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  Drinking Water
                </li>
              </ul>
            </div>

            {selectedShelter.description && (
              <div>
                <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200 pb-2 mb-2">Description</h4>
                <p className="text-stone-700 text-sm leading-relaxed">{selectedShelter.description}</p>
              </div>
            )}

            {selectedShelter.contact && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs text-emerald-800 uppercase tracking-wider font-semibold mb-1">Contact Details</p>
                <p className="text-emerald-900 font-medium">{selectedShelter.contact}</p>
              </div>
            )}
            
            <div className="flex gap-3 pt-4 border-t border-stone-200">
              <button className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-white font-bold transition shadow-md shadow-emerald-900/20">
                Get Directions
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SheltersPage;
