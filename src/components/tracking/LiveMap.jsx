import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Package } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, emoji) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 18px;">${emoji}</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const driverIcon = createCustomIcon('#10b981', '🚗');
const customerIcon = createCustomIcon('#3b82f6', '📍');
const restaurantIcon = createCustomIcon('#f97316', '🏪');

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function LiveMap({
  driverLocation,
  customerLocation,
  restaurantLocation,
  orderStatus,
  className = ""
}) {
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);

  useEffect(() => {
    if (driverLocation?.lat && driverLocation?.lng) {
      setMapCenter([driverLocation.lat, driverLocation.lng]);
    } else if (customerLocation?.lat && customerLocation?.lng) {
      setMapCenter([customerLocation.lat, customerLocation.lng]);
    }
  }, [driverLocation, customerLocation]);

  // Create route path
  const routeCoordinates = [];
  if (restaurantLocation?.lat && restaurantLocation?.lng) {
    routeCoordinates.push([restaurantLocation.lat, restaurantLocation.lng]);
  }
  if (driverLocation?.lat && driverLocation?.lng) {
    routeCoordinates.push([driverLocation.lat, driverLocation.lng]);
  }
  if (customerLocation?.lat && customerLocation?.lng) {
    routeCoordinates.push([customerLocation.lat, customerLocation.lng]);
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={14}
        className="w-full h-full min-h-[300px]"
        style={{ background: '#f3f4f6' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={mapCenter} />

        {/* Restaurant Marker */}
        {restaurantLocation?.lat && restaurantLocation?.lng && (
          <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={restaurantIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Restaurant</p>
                <p className="text-sm text-gray-500">Pickup Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Driver Marker */}
        {driverLocation?.lat && driverLocation?.lng && (
          <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Driver</p>
                <p className="text-sm text-gray-500">On the way</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Customer Marker */}
        {customerLocation?.lat && customerLocation?.lng && (
          <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customerIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Delivery Location</p>
                <p className="text-sm text-gray-500">Your address</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routeCoordinates.length >= 2 && (
          <Polyline
            positions={routeCoordinates}
            color="#10b981"
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}
      </MapContainer>

      {/* Status Overlay */}
      {orderStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 capitalize">{orderStatus.replace('_', ' ')}</p>
              <p className="text-sm text-gray-500">Live tracking active</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}