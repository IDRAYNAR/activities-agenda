import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function ParticipantsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const activity = await prisma.activity.findFirst({
    where: {
      id: parseInt(params.id),
      organizer: {
        email: session.user.email
      }
    },
    include: {
      reservations: {
        include: {
          user: true
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
          <h3 className="text-lg leading-6 font-medium text-gray-900">
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {reservation.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reservation.user.email}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Inscrit le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 