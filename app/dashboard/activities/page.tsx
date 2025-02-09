import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { DeleteActivityButton } from '@/app/components/DeleteActivityButton';

export default async function MyActivitiesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      organizedActivities: {
        include: {
          type: true,
          reservations: {
            include: {
              user: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    redirect('/login');
  }

  const activities = user.organizedActivities;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes activités</h1>
        <Link
          href="/dashboard/activities/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Créer une activité
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Vous n'avez pas encore créé d'activités.</p>
            <Link
              href="/dashboard/activities/new"
              className="mt-4 inline-flex items-center text-sm text-violet-600 hover:text-violet-500"
            >
              Commencer à créer une activité
            </Link>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-medium text-gray-900 truncate">
                        {activity.name}
                      </h2>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                          {activity.type.name}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(activity.startTime).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/dashboard/activities/${activity.id}/participants`}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 hover:text-violet-600"
                      >
                        <UserGroupIcon className="h-5 w-5 mr-1" />
                        {activity.reservations.length} participant(s)
                      </Link>
                      
                      <Link
                        href={`/dashboard/activities/${activity.id}/edit`}
                        className="inline-flex items-center p-1.5 text-sm text-gray-700 hover:text-violet-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                        <span className="sr-only">Modifier</span>
                      </Link>

                      <DeleteActivityButton 
                        activityId={activity.id}
                        className="inline-flex items-center p-1.5 text-sm text-red-700 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span className="sr-only">Supprimer</span>
                      </DeleteActivityButton>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 