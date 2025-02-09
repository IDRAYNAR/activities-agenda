import { Activity, ActivityType, Reservation } from '@prisma/client';
import Link from 'next/link';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

type ActivityWithType = Activity & {
  type: ActivityType;
  reservations: Reservation[];
};

export default function ActivityList({
  activities,
}: {
  activities: ActivityWithType[];
}) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <li key={activity.id}>
            <Link href={`/dashboard/activities/${activity.id}`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {activity.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {activity.type.name}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="text-sm text-gray-500">
                      {activity.available} places disponibles
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {new Date(activity.startTime).toLocaleDateString()}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {activity.duration} minutes
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {activity.reservations.length} réservation(s)
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 