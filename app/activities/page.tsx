import { prisma } from '@/lib/prisma';
import { SearchActivities } from '@/app/components/SearchActivities';
import { ActivityFilters } from '@/app/components/ActivityFilters';
import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Pagination } from '@/app/components/Pagination';
import { Prisma } from '@prisma/client';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ActivitiesPage({
  searchParams,
}: Props) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const type = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : undefined;
  const query = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined;

  const where: Prisma.ActivityWhereInput = {
    AND: [
      query ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: query, mode: 'insensitive' as Prisma.QueryMode } }
        ]
      } : {},
      type ? { typeId: parseInt(type) } : {}
    ]
  };

  const [activities, total, types] = await Promise.all([
    prisma.activity.findMany({
      where,
      take: 9,
      skip: (page - 1) * 9,
      orderBy: { startTime: 'asc' },
      include: {
        type: true,
        organizer: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        reservations: true
      }
    }),
    prisma.activity.count({ where }),
    prisma.activityType.findMany()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Découvrez nos activités</h1>
        
        <div className="space-y-4">
          <SearchActivities />
          <ActivityFilters types={types} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const isFullyBooked = activity.available <= 0;
            const isRegistered = activity.reservations.length > 0;
            
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
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Complet
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {activity.available} places disponibles
                      </span>
                    )}
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
                </div>
              </Link>
            );
          })}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune activité ne correspond à votre recherche.</p>
          </div>
        )}

        <div className="mt-6">
          <Pagination totalItems={total} itemsPerPage={9} />
        </div>
      </div>
    </div>
  );
} 