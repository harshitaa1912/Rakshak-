import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to dynamically update map center/zoom
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const DisasterMap = ({ shelters = [], sosRequests = [], reports = [], center = [20.5937, 78.9629], zoom = 5, onMarkerClick }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => console.log('Location access denied or failed', err)
      );
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-emerald-900/10 relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} zoom={zoom} />

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="font-semibold">Your Location</div>
            </Popup>
          </Marker>
        )}

        {shelters.map((shelter) => (
          <Circle 
            key={shelter._id || shelter.id} 
            center={[shelter.location.coordinates[1], shelter.location.coordinates[0]]} 
            radius={500} 
            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.5 }}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick({ type: 'shelter', data: shelter })
            }}
          >
            <Popup>
              <div className="font-bold">{shelter.name}</div>
              <div className="text-sm">Status: {shelter.status}</div>
              <div className="text-sm">Capacity: {shelter.currentOccupancy}/{shelter.capacity}</div>
            </Popup>
          </Circle>
        ))}

        {sosRequests.map((sos) => (
          <Circle 
            key={sos._id || sos.id} 
            center={[sos.location.coordinates[1], sos.location.coordinates[0]]} 
            radius={300} 
            pathOptions={{ 
              color: sos.status === 'pending' ? '#ef4444' : '#9ca3af', 
              fillColor: sos.status === 'pending' ? '#ef4444' : '#9ca3af', 
              fillOpacity: 0.7 
            }}
            className={sos.status === 'pending' ? 'animate-pulse' : ''}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick({ type: 'sos', data: sos })
            }}
          >
            <Popup>
              <div className="font-bold text-red-600">SOS: {sos.emergencyType}</div>
              <div className="text-sm">Status: {sos.status}</div>
              <div className="text-xs mt-1">{new Date(sos.createdAt).toLocaleString()}</div>
            </Popup>
          </Circle>
        ))}

        {reports && reports.map((report) => (
          <Circle 
            key={report._id || report.id} 
            center={[report.location.coordinates[1], report.location.coordinates[0]]} 
            radius={400} 
            pathOptions={{ 
              color: '#f97316', 
              fillColor: '#f97316', 
              fillOpacity: 0.6 
            }}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick({ type: 'report', data: report })
            }}
          >
            <Popup>
              <div className="font-bold text-orange-600 uppercase">{report.reportType.replace('-', ' ')}</div>
              <div className="text-sm">{report.description}</div>
              <div className="text-xs mt-1">Severity: <span className="font-semibold">{report.severity}</span></div>
              <div className="text-xs mt-1 text-stone-500">{new Date(report.createdAt).toLocaleString()}</div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default DisasterMap;
