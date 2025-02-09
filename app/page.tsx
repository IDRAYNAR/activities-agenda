import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import FeaturedActivitiesWrapper from './components/FeaturedActivitiesWrapper';
import FeaturedCategories from './components/FeaturedCategories';

export const metadata: Metadata = {
  title: 'Accueil - Réservation d\'activités',
  description: 'Plateforme de réservation d\'activités sportives et de loisirs',
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const featuredActivities = await prisma.activity.findMany({
    take: 6,
    orderBy: [
      {
        reservations: {
          _count: 'desc'
        }
      }
    ],
    include: {
      type: true,
      organizer: true,
      reservations: {
        where: session?.user?.email ? {
          user: {
            email: session.user.email
          }
        } : undefined
      },
      _count: {
        select: {
          reservations: true
        }
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-800">
          Bienvenue sur <span className="text-violet-600">notre plateforme d&apos;activités</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Découvrez et réservez facilement vos activités préférées. Sports, loisirs et bien plus encore vous attendent !
        </p>
      </div>

      <div className="mb-16">
        <FeaturedCategories />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8 dark:text-gray-800">Activités populaires</h2>
        <FeaturedActivitiesWrapper activities={featuredActivities} />
      </div>
    </div>
  );
}
