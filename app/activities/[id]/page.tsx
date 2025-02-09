// Page de détail d'une activité
// Affiche toutes les informations d'une activité spécifique
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CalendarIcon, ClockIcon, UserGroupIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ActivityMapSection } from '@/app/components/ActivityMapSection';
import Link from 'next/link';
import { ReservationButton } from '@/app/components/ReservationButton';

// Types pour les props de la page
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ActivityPage({ params }: Props) {
  // Récupération de la session utilisateur
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;
  const activityId = parseInt(resolvedParams.id);

  if (isNaN(activityId)) {
    notFound();
  }

  // Récupération des détails de l'activité depuis la base de données
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      type: true,
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      reservations: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  });

  // Redirection vers 404 si l'activité n'existe pas
  if (!activity) {
    notFound();
  }

  // Calcul des places restantes
  const remainingSpots = activity.available;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* En-tête avec bouton retour */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/activities"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Retour aux activités
        </Link>

        {/* Informations principales de l'activité */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">{activity.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Organisé par {activity.organizer.firstName} {activity.organizer.lastName}
            </p>
          </div>

          {/* Détails de l'activité */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>
                    {new Date(activity.startTime).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>
                    {new Date(activity.startTime).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {' - '}
                    {new Date(new Date(activity.startTime).getTime() + activity.duration * 60000).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  <span>
                    {remainingSpots} places restantes
                  </span>
                </div>
              </div>

              {/* Description de l'activité */}
              <div className="sm:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{activity.description}</p>
              </div>

              {/* Carte de localisation */}
              <div className="sm:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Localisation</h3>
                <ActivityMapSection
                  latitude={activity.latitude}
                  longitude={activity.longitude}
                  address={activity.address}
                  name={activity.name}
                />
              </div>

              {/* Bouton de réservation */}
              <div className="sm:col-span-2 mt-6">
                <ReservationButton
                  activityId={activity.id}
                  available={activity.available}
                  isRegistered={activity.reservations.some(
                    reservation => 
                      reservation.user.firstName === session?.user?.name?.split(' ')[0] &&
                      reservation.user.lastName === session?.user?.name?.split(' ')[1]
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 