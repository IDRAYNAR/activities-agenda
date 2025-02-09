import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ActivityList from '../components/ActivityList';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Si l'utilisateur est admin, rediriger vers le dashboard admin
  if (session.user.role === 'ADMIN') {
    redirect('/dashboard/admin');
  }

  const userWithReservations = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      reservations: {
        include: {
          activity: {
            include: {
              type: true,
              organizer: true,
            }
          }
        }
      }
    }
  });

  const activities = userWithReservations?.reservations.map(r => ({
    ...r.activity,
    type: r.activity.type,
  })) || [];

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Mes activités
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
                    Activités réservées
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
          Mes réservations
        </h3>
        {activities.length > 0 ? (
          <ActivityList activities={activities} />
        ) : (
          <p className="text-gray-500 text-center py-8">
            Vous n&apos;avez pas encore réservé d&apos;activités.
          </p>
        )}
      </div>
    </div>
  );
}