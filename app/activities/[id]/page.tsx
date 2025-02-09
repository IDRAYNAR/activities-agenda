import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CalendarIcon, ClockIcon, UserGroupIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ActivityMapSection } from '@/app/components/ActivityMapSection';
import Link from 'next/link';
import { ReservationButton } from '@/app/components/ReservationButton';

export default async function ActivityPage({ params }: { params: { id: string } }) {
  // Vérifier que l'ID est valide avant de l'utiliser
  const activityId = Number(params.id);
  if (isNaN(activityId)) {
    notFound();
  }

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      type: true,
      organizer: true,
    },
  });

  if (!activity) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/activities"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Retour aux activités
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800">
              {activity.type.name}
            </span>
            <span className="text-sm text-gray-500">
              {activity.available} places disponibles
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {activity.name}
          </h1>

          <p className="mt-4 text-gray-600">
            {activity.description}
          </p>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-gray-700">
                  {new Date(activity.startTime).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-gray-700">
                  {new Date(activity.startTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} - {activity.duration} minutes
                </span>
              </div>
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-gray-700">
                  Organisé par {activity.organizer.firstName} {activity.organizer.lastName}
                </span>
              </div>
            </dl>
          </div>

          <ActivityMapSection
            latitude={activity.latitude}
            longitude={activity.longitude}
            address={activity.address}
            name={activity.name}
          />

          <div className="mt-6">
            <ReservationButton 
              activityId={activity.id} 
              available={activity.available}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 