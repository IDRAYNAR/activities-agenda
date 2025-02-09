'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Activity, ActivityType } from '@prisma/client';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

type ActivityWithType = Activity & {
  type: ActivityType;
};

export default function ActivityList({
  activities,
}: {
  activities: ActivityWithType[];
}) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const router = useRouter();

  const handleCancelReservation = async (activityId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      setLoadingId(activityId);
      const response = await fetch(`/api/reservations/${activityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'annulation');
      }

      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'annulation');
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffTime = activityDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Demain";
    } else if (diffDays < 7) {
      return activityDate.toLocaleDateString('fr-FR', { weekday: 'long' });
    } else {
      return activityDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
      });
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.id}
          className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 hover:ring-violet-500 transition-all"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Link 
                    href={`/activities/${activity.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-violet-600"
                  >
                    {activity.name}
                  </Link>
                  <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800">
                    {activity.type.name}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {activity.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{formatDate(activity.startTime)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{new Date(activity.startTime).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} - {activity.duration} min</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="truncate">{activity.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-6 flex-shrink-0">
                <button
                  onClick={() => handleCancelReservation(activity.id)}
                  disabled={loadingId === activity.id}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-wait transition-colors"
                >
                  {loadingId === activity.id ? 'Annulation...' : 'Se désinscrire'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {activities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Vous n&apos;avez pas encore réservé d&apos;activités.</p>
        </div>
      )}
    </div>
  );
} 