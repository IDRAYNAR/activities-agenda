'use client';

import Link from 'next/link';
import { Activity, ActivityType } from '@prisma/client';
import { useSession } from 'next-auth/react';

type ActivityWithDetails = Activity & {
  type: ActivityType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reservations: any[];
  _count: {
    reservations: number;
  };
};

export function FeaturedActivities({ activities }: { activities: ActivityWithDetails[] }) {
  const { data: session } = useSession();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {activities.map((activity) => {
        const isFullyBooked = activity.available <= 0;
        const isRegistered = session ? 
          activity._count.reservations > 0 && 
          activity.reservations.some(r => r.user.email === session.user?.email) 
          : false;

        return (
          <Link
            key={activity.id}
            href={`/activities/${activity.id}`}
            className={`block bg-white rounded-lg shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow ${
              isFullyBooked || isRegistered ? 'opacity-75' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800">
                  {activity.type.name}
                </span>
                {isRegistered ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Inscrit
                  </span>
                ) : isFullyBooked ? (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Complet
                  </span>
                ) : (

                  <span className="text-sm text-gray-500">
                    {activity.available} places disponibles
                  </span>
                )}
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {activity.name}
              </h3>
              
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {activity.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
} 