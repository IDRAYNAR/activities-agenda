import { LeisureIcon, SportsIcon, WellnessIcon } from "./Icons";
import Link from 'next/link';

export default function FeaturedCategories() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Explorez nos univers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SportsIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Sports</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Découvrez des activités sportives palpitantes pour tous les niveaux.
            </p>
            <Link 
              href="/activities?type=15"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center"
            >
              Explorer →
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LeisureIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Loisirs</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Exprimez votre créativité avec nos ateliers et activités artistiques.
            </p>
            <Link 
              href="/activities?type=4"
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium inline-flex items-center"
            >
              Découvrir →
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <WellnessIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Bien-être</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Prenez soin de vous avec nos activités relaxantes et revitalisantes.
            </p>
            <Link 
              href="/activities?type=8"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium inline-flex items-center"
            >
              Essayer →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 