'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityType } from '@prisma/client';

export default function NewActivityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [types, setTypes] = useState<ActivityType[]>([]);

  useEffect(() => {
    fetch('/api/activity-types')
      .then(res => res.json())
      .then(data => setTypes(data))
      .catch(err => console.error('Erreur lors du chargement des types:', err));
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
      startTime: new Date(formData.get('startTime') as string).toISOString(),
      duration: Number(formData.get('duration')),
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
        const error = await res.json();
        throw new Error(error.message || 'Une erreur est survenue');
      }

      router.push('/dashboard/activities');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Créer une nouvelle activité</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom de l&apos;activité
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              step="15"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Date et heure de début
          </label>
          <input
            type="datetime-local"
            name="startTime"
            id="startTime"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Création en cours...' : 'Créer l\'activité'}
          </button>
        </div>
      </form>
    </div>
  );
} 