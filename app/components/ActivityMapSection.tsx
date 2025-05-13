// Composant de carte pour afficher la localisation d'une activité
// Utilise Leaflet en mode client-side uniquement
'use client';

import dynamic from 'next/dynamic';
import { MapPinIcon } from '@heroicons/react/24/outline';

// Chargement dynamique de la carte pour éviter les problèmes de SSR
const ActivityMap = dynamic(() => import('@/app/components/ActivityMap'), {
  loading: () => <p>Chargement de la carte...</p>,
  ssr: false
});

// Interface pour les props du composant
interface ActivityMapSectionProps {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

// Composant principal qui affiche la carte et l'adresse
export function ActivityMapSection({ latitude, longitude, address, name }: ActivityMapSectionProps) {
  return (
    <div>
      {/* Affichage de l'adresse avec une icône */}
      <div className="flex items-center mb-4 text-gray-700">
        <MapPinIcon className="h-5 w-5 mr-2" />
        <span>{address}</span>
      </div>
      
      {/* Carte interactive */}
      <div className="h-[400px] rounded-lg overflow-hidden">
        <ActivityMap
          latitude={latitude}
          longitude={longitude}
          address={address}
          name={name}
        />
      </div>
    </div>
  );
} 