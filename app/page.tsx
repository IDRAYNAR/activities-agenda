import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { FeaturedActivities } from './components/FeaturedActivities';

export const metadata: Metadata = {
  title: 'Accueil - Réservation d\'activités',
  description: 'Plateforme de réservation d\'activités sportives et de loisirs',
};

export default async function HomePage() {
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
      _count: {
        select: {
          reservations: true
        }
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Bienvenue sur <span className="text-violet-600">notre plateforme d&apos;activités</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Découvrez et réservez facilement vos activités préférées. Sports, loisirs et bien plus encore vous attendent !
        </p>
      </div>

      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold mb-2">Sports</h3>
            <p className="text-gray-600">Découvrez nos activités sportives pour tous les niveaux.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold mb-2">Loisirs</h3>
            <p className="text-gray-600">Des activités récréatives pour toute la famille.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold mb-2">Bien-être</h3>
            <p className="text-gray-600">Prenez soin de vous avec nos activités de bien-être.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8">Activités populaires</h2>
        <FeaturedActivities activities={featuredActivities} />
      </div>
    </div>
  );
}
