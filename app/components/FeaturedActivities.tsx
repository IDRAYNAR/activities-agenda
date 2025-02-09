'use client';

import Link from 'next/link';
import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import type { Activity, ActivityType, User } from '@prisma/client';

type ActivityWithDetails = Activity & {
  type: ActivityType;
  organizer: User;
  _count: {
    reservations: number;
  };
};

export function FeaturedActivities({ activities }: { activities: ActivityWithDetails[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => {
        const isFullyBooked = activity.available <= 0;
        
        return (
          <Link
            key={activity.id}
            href={`/activities/${activity.id}`}
            className={`block group ${isFullyBooked ? 'opacity-75' : ''}`}
          >
            <div className={`bg-white rounded-lg shadow-sm ring-1 h-full
              ${isFullyBooked 
                ? 'ring-gray-200 hover:ring-gray-300' 
                : 'ring-gray-200 hover:ring-violet-500'} 
              transition-all`}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800">
                    {activity.type.name}
                  </span>
                  <span className={`text-sm ${isFullyBooked ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    {isFullyBooked 
                      ? 'Complet' 
                      : `${activity.available} places disponibles`
                    }
                  </span>
                </div>
                
                <h2 className={`mt-4 text-lg font-semibold 
                  ${isFullyBooked 
                    ? 'text-gray-600 group-hover:text-gray-900' 
                    : 'text-gray-900 group-hover:text-violet-600'}`}
                >
                  {activity.name}
                </h2>
                
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-grow">
                  {activity.description}
                </p>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(activity.startTime).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {activity.duration} min
                  </div>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  Organisé par {activity.organizer.firstName} {activity.organizer.lastName}
                </div>

                {isFullyBooked && (
                  <div className="mt-4 text-sm text-red-500 bg-red-50 rounded-md p-2 text-center">
                    Cette activité est complète
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
} 