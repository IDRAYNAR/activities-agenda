'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuration de l'icône du marqueur personnalisé
const icon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Interface pour les props du composant
interface ActivityMapProps {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

export default function ActivityMap({ latitude, longitude, address, name }: ActivityMapProps) {
  useEffect(() => {
    // Correction des icônes Leaflet pour Next.js
    // Cette configuration est nécessaire pour le bon fonctionnement des icônes en SSR
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: '/images/marker-icon.png',
      iconRetinaUrl: '/images/marker-icon-2x.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      {/* Conteneur de la carte avec configuration initiale */}
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Couche de tuiles OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marqueur de l'activité avec popup */}
        <Marker position={[latitude, longitude]} icon={icon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{name}</p>
              <p>{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
} 