// Layout principal du tableau de bord
// Gère l'authentification et la structure commune des pages du dashboard
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import DashboardNav from '../components/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérification de l'authentification
  const session = await getServerSession();

  // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!session) {
    redirect('/login');
  }

  // Structure du layout avec navigation et contenu principal
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barre de navigation du tableau de bord */}
      <DashboardNav />
      {/* Contenu principal avec espacement et largeur maximale */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 