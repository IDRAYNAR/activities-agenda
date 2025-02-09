import { prisma } from '@/lib/prisma';
import { SearchActivities } from '@/app/components/SearchActivities';
import { ActivityFilters } from '@/app/components/ActivityFilters';
import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Pagination } from '@/app/components/Pagination';

interface SearchParams {
  query?: string;
  type?: string;
  page?: string;
}

async function getActivities(searchParams: SearchParams) {
  const query = searchParams.query;
  const typeId = searchParams.type ? parseInt(searchParams.type) : undefined;
  const page = Number(searchParams.page) || 1;
  const itemsPerPage = 9;

  const [activities, count] = await Promise.all([
    prisma.activity.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          } : {},
          typeId ? { typeId } : {},
        ],
      },
      include: {
        type: true,
        organizer: true,
      },
      orderBy: {
        startTime: 'asc',
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
    prisma.activity.count({
      where: {
        AND: [
          query ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          } : {},
          typeId ? { typeId } : {},
        ],
      },
    }),
  ]);

  return { activities, count };
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [{ activities, count }, types] = await Promise.all([
    getActivities(searchParams),
    prisma.activityType.findMany(),
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

        {activities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune activité ne correspond à votre recherche.</p>
          </div>
        )}

        <div className="mt-6">
          <Pagination totalItems={count} itemsPerPage={9} />
        </div>
      </div>
    </div>
  );
} 