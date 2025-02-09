'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex items-center gap-x-12">
          <Link href="/" className="-m-1.5 p-1.5 text-xl font-semibold text-violet-600">
            Activiz
          </Link>
          <div className="hidden lg:flex lg:gap-x-6">
            <Link 
              href="/" 
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-violet-600"
            >
              Accueil
            </Link>
            <Link 
              href="/activities" 
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-violet-600"

            >
              Liste des activités
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-x-6">
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          ) : session ? (
            <UserMenu userName={`${session.user?.name}`} />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-violet-600"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
} 