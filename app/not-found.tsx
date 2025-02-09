import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="mt-60 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-9xl font-bold text-violet-600 mb-8">404</h1>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Oups ! Page introuvable
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          La page que vous cherchez semble avoir été déplacée, supprimée ou n&apos;existe pas.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
} 