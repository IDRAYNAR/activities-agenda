import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import ActivityList from '../components/ActivityList';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default async function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const session = await getServerSession();
  
  const activities = await prisma.activity.findMany({
    where: {
      // Ajoutez des conditions de filtrage si nécessaire
    },
    include: {
      type: true,
      reservations: true,
    },
  });

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Tableau de bord
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Activités totales
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activities.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Activités récentes
        </h3>
        <ActivityList activities={activities} />
      </div>
    </div>
  );
} 