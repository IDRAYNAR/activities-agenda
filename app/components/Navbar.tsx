'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { FiUser, FiLogOut } from 'react-icons/fi';

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-indigo-700' : '';
  };

  const getDashboardLink = () => {
    if (!session?.user?.role) return null;
    return session.user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard';
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
                  className={`${isActive('/')} text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700`}
                >
                  Accueil
                </Link>
                <Link
                  href="/activities"
                  className={`${isActive('/activities')} text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700`}
                >
                  Activités
                </Link>
                {dashboardLink && (
                  <Link
                    href={dashboardLink}
                    className={`${isActive(dashboardLink)} text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700`}
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
                    className="flex items-center text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    <FiUser className="h-5 w-5 mr-2" />
                    {session.user?.firstName} {session.user?.lastName}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    <FiLogOut className="h-5 w-5 mr-2" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 