'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ActivityType } from '@prisma/client';

type ActivityFormProps = {
  types: ActivityType[];
  activity?: Activity;
};

export function ActivityForm({ types, activity }: ActivityFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: activity?.name || '',
    description: activity?.description || '',
    startTime: activity ? new Date(activity.startTime).toISOString().slice(0, 16) : '',
    duration: activity?.duration.toString() || '',
    available: activity?.available.toString() || '',
    address: activity?.address || '',
    latitude: activity?.latitude.toString() || '',
    longitude: activity?.longitude.toString() || '',
    typeId: activity?.typeId.toString() || ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activity) {
        // En mode édition, n'envoyer que les champs modifiables
        const editableData = {
          description: formData.description,
          duration: formData.duration,
          available: formData.available
        };

        const response = await fetch(`/api/activities/${activity.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editableData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Une erreur est survenue');
        }
      } else {
        // En mode création, envoyer toutes les données
        const response = await fetch('/api/activities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Une erreur est survenue');
        }
      }

      router.push('/dashboard/activities');
      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      {activity && (
        <div className="rounded-md bg-blue-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Modification limitée</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Pour garantir la fiabilité des informations pour les participants déjà inscrits, 
                  certains champs ne peuvent pas être modifiés après la création de l'activité 
                  (nom, date, lieu et type d'activité). Vous pouvez toujours ajuster la description, 
                  la durée et le nombre de places disponibles.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom de l&apos;activité
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          readOnly={!!activity}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Date et heure
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            required
            readOnly={!!activity}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Durée (minutes)
          </label>
          <input
            type="number"
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            required
            min="1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="available" className="block text-sm font-medium text-gray-700">
            Places disponibles
          </label>
          <input
            type="number"
            id="available"
            value={formData.available}
            onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.value }))}
            required
            min="1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type d&apos;activité
          </label>
          <select
            id="type"
            value={formData.typeId}
            onChange={(e) => setFormData(prev => ({ ...prev, typeId: e.target.value }))}
            required
            disabled={!!activity}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm bg-gray-100 cursor-not-allowed"
          >
            <option value="">Sélectionner un type</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Adresse
        </label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          required
          readOnly={!!activity}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            id="latitude"
            value={formData.latitude}
            onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
            required
            readOnly={!!activity}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            id="longitude"
            value={formData.longitude}
            onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
            required
            readOnly={!!activity}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? 'Enregistrement...' : activity ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
} 