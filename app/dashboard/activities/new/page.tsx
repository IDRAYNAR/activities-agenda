'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityType } from '@prisma/client';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function NewActivityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [types, setTypes] = useState<ActivityType[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    fetch('/api/activity-types')
      .then(res => res.json())
      .then(data => setTypes(data))
      .catch(err => {
        console.error('Erreur lors du chargement des types:', err);
        setError('Erreur lors du chargement des types d\'activité');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      typeId: formData.get('typeId'),
      description: formData.get('description'),
      available: Number(formData.get('available')),
      startTime: formData.get('startTime'),
      duration: Number(formData.get('duration')),
      address: formData.get('address'),
      latitude: formData.get('latitude'),
      longitude: formData.get('longitude'),
    };

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Une erreur est survenue');
      }

      router.push('/dashboard/activities');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir la position actuelle
  const getCurrentPosition = () => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Mettre à jour les champs de latitude et longitude
        const latitudeInput = document.getElementById('latitude') as HTMLInputElement;
        const longitudeInput = document.getElementById('longitude') as HTMLInputElement;
        if (latitudeInput && longitudeInput) {
          latitudeInput.value = position.coords.latitude.toString();
          longitudeInput.value = position.coords.longitude.toString();
        }
        setLocationLoading(false);
      },
      (error) => {
        let message = 'Erreur lors de la récupération de la position';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Vous avez refusé l\'accès à votre position';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'La position n\'est pas disponible';
            break;
          case error.TIMEOUT:
            message = 'La demande de position a expiré';
            break;
        }
        setLocationError(message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Fonction pour obtenir les coordonnées à partir d'une adresse
  const getCoordinatesFromAddress = async (address: string) => {
    if (!address.trim()) return;
    
    setAddressLoading(true);
    setLocationError('');

    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitudeInput = document.getElementById('latitude') as HTMLInputElement;
        const longitudeInput = document.getElementById('longitude') as HTMLInputElement;
        const addressInput = document.getElementById('address') as HTMLInputElement;

        if (latitudeInput && longitudeInput && addressInput) {
          latitudeInput.value = lat;
          longitudeInput.value = lon;
          addressInput.value = display_name; // Adresse complète formatée
        }
      } else {
        setLocationError('Aucun résultat trouvé pour cette adresse');
      }
    } catch (error) {
      setLocationError('Erreur lors de la recherche de l\'adresse');
      console.error('Erreur:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Créer une nouvelle activité</h1>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
        {/* Informations générales */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Informations générales</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom de l&apos;activité
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:text-gray-800"
              />
            </div>

            <div>
              <label htmlFor="typeId" className="block text-sm font-medium text-gray-700">
                Type d&apos;activité
              </label>
              <select
                name="typeId"

                id="typeId"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:text-gray-800"
              >
                <option value="">Sélectionnez un type</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="available" className="block text-sm font-medium text-gray-700">
                Places disponibles
              </label>
              <input
                type="number"
                name="available"
                id="available"
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:text-gray-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:text-gray-800"
              placeholder="Décrivez votre activité..."
            />
          </div>
        </div>

        {/* Date et durée */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Date et durée</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Date et heure de début
              </label>
              <input
                type="datetime-local"
                name="startTime"
                id="startTime"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:text-gray-800"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Durée (minutes)
              </label>
              <input
                type="number"
                name="duration"
                id="duration"
                min="15"
                step="1"
                required
                placeholder="Ex: 60"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Localisation</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Saisissez une adresse..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    const addressInput = document.getElementById('address') as HTMLInputElement;
                    if (addressInput) {
                      getCoordinatesFromAddress(addressInput.value);
                    }
                  }}
                  disabled={addressLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
                >
                  {addressLoading ? 'Recherche...' : 'Rechercher'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  id="latitude"
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  id="longitude"
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:text-gray-800"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={getCurrentPosition}
              disabled={locationLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
            >
              <MapPinIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              {locationLoading ? 'Récupération...' : 'Utiliser ma position actuelle'}
            </button>

            {locationError && (
              <p className="text-sm text-red-600">{locationError}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création en cours...' : 'Créer l\'activité'}
          </button>
        </div>
      </form>
    </div>
  );
} 