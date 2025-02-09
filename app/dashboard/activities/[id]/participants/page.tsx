import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ParticipantsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const activity = await prisma.activity.findFirst({
    where: {
      id: parseInt(resolvedParams.id),
      organizer: {
        email: session.user.email
      }
    },
    include: {
      reservations: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!activity) {
    redirect('/dashboard/activities');
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/dashboard/activities"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour à mes activités
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Participants pour {activity.name}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {activity.reservations.length} participant(s)
          </p>
        </div>
        
        {activity.reservations.length === 0 ? (
          <div className="px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500">
              Aucun participant inscrit pour le moment.
            </p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {activity.reservations.map((reservation) => (
              <li key={reservation.id} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {`${reservation.user.firstName} ${reservation.user.lastName}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {reservation.user.email}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5 flex-shrink-0" />
                    <time dateTime={reservation.createdAt.toISOString()}>
                      Inscrit le {new Date(reservation.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </time>
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