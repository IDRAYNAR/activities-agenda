'use client';

import { useEffect, useState } from 'react';
import { FiUsers, FiCalendar, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';
import StatsCard from '../components/StatsCard';
import TopActivities from '../components/TopActivities';
import RecentReservations from '../components/RecentReservations';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  stats: {
    totalUsers: number;
    totalActivities: number;
    totalReservations: number;
    activeReservations: number;
    reservationRate: number;
  };
  topActivities: {
    id: string;
    name: string;
    reservationCount: number;
  }[];
  recentReservations: {
    id: string;
    activityName: string;
    userName: string;
    userEmail: string;
    date: string;
  }[];
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
        const stats = await response.json();
        setData(stats);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord administrateur</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Utilisateurs"
              value={data.stats.totalUsers}
              icon={<FiUsers className="h-6 w-6" />}
            />
            <StatsCard
              title="Activités"
              value={data.stats.totalActivities}
              icon={<FiCalendar className="h-6 w-6" />}
            />
            <StatsCard
              title="Réservations actives"
              value={data.stats.activeReservations}
              icon={<FiCheckSquare className="h-6 w-6" />}
            />
            <StatsCard
              title="Taux de réservation"
              value={`${Math.round(data.stats.reservationRate)}%`}
              icon={<FiTrendingUp className="h-6 w-6" />}
            />
          </div>

          {/* Graphiques et listes */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TopActivities activities={data.topActivities} />
            <RecentReservations reservations={data.recentReservations} />
          </div>
        </div>
      </div>
    </div>
  );
}