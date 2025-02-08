import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accueil - Réservation d\'activités',
  description: 'Plateforme de réservation d\'activités sportives et de loisirs',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Bienvenue sur</span>
            <span className="block text-indigo-600">notre plateforme d&apos;activités</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Découvrez et réservez facilement vos activités préférées. 
            Sports, loisirs et bien plus encore vous attendent !
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Exemple de carte d'activité */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Sports</h3>
                <p className="mt-2 text-base text-gray-500">
                  Découvrez nos activités sportives pour tous les niveaux.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Loisirs</h3>
                <p className="mt-2 text-base text-gray-500">
                  Des activités récréatives pour toute la famille.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Bien-être</h3>
                <p className="mt-2 text-base text-gray-500">
                  Prenez soin de vous avec nos activités de bien-être.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
