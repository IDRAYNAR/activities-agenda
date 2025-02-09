// Composant de layout côté client
// Gère la navigation et la structure commune des pages publiques
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { Session } from 'next-auth';

export default function ClientLayout({ 
  children, 
  session 
}: { 
  children: React.ReactNode;
  session: Session | null;
}) {
  // Récupération du chemin actuel pour la navigation
  const pathname = usePathname();

  // Structure principale avec barre de navigation et contenu
  return (
    <div key={pathname}>
      {/* Barre de navigation avec état de session */}
      <Navbar session={session} />
      {/* Contenu principal avec espacement responsive */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 