'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { FiUser, FiLogOut, FiX, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getDashboardLink = () => {
    if (!session?.user?.role) return null;
    return session.user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard';
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="bg-indigo-600 dark:bg-indigo-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-xl">
                Activities Agenda
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/' ? 'bg-indigo-700 dark:bg-indigo-800' : ''
                  }`}
                >
                  Accueil
                </Link>
                <Link
                  href="/activities"
                  className={`text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/activities' ? 'bg-indigo-700 dark:bg-indigo-800' : ''
                  }`}
                >
                  Activités
                </Link>
                {dashboardLink && (
                  <Link
                    href={dashboardLink}
                    className={`text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === dashboardLink ? 'bg-indigo-700 dark:bg-indigo-800' : ''
                    }`}
                  >
                    {session?.user?.role === 'ADMIN' ? 'Administration' : 'Tableau de bord'}
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {session ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="flex items-center text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    <FiUser className="h-5 w-5 mr-2" />
                    {session.user?.firstName} {session.user?.lastName}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    <FiLogOut className="h-5 w-5 mr-2" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-800"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`text-white block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/' ? 'bg-indigo-700 dark:bg-indigo-800' : ''
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/activities"
              className={`text-white block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/activities' ? 'bg-indigo-700 dark:bg-indigo-800' : ''
              }`}
            >
              Activités
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-indigo-700 dark:border-indigo-800">
            {session ? (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <FiUser className="h-10 w-10 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {session.user?.firstName} {session.user?.lastName}
                    </div>
                    <div className="text-sm font-medium text-indigo-200">
                      {session.user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-800"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 