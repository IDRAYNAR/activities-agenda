import { LeisureIcon, SportsIcon, WellnessIcon } from "./Icons";
import Link from 'next/link';

export default function FeaturedCategories() {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Explorez nos univers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 text-blue-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SportsIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sports</h3>
            <p className="text-gray-600 mb-4">
              Découvrez des activités sportives palpitantes pour tous les niveaux.
            </p>
            <Link 
              href="/activities?type=15"
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              Explorer →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-green-100 text-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LeisureIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Loisirs</h3>
            <p className="text-gray-600 mb-4">

              Exprimez votre créativité avec nos ateliers et activités artistiques.
            </p>
            <Link 
              href="/activities?type=4"
              className="text-green-600 hover:text-green-800 font-medium inline-flex items-center"
            >
              Découvrir →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 text-purple-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <WellnessIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Bien-être</h3>
            <p className="text-gray-600 mb-4">
              Prenez soin de vous avec nos activités relaxantes et revitalisantes.
            </p>
            <Link 
              href="/activities?type=8"
              className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center"
            >
              Essayer →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 