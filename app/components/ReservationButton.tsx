'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type ReservationButtonProps = {
  activityId: number;
  available: number;
  isRegistered: boolean;
};

export function ReservationButton({ activityId, available, isRegistered }: ReservationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();

  const handleReservation = async () => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <button
        disabled
        className="w-full rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-800 cursor-not-allowed"
      >
        Déjà inscrit
      </button>
    );
  }

  if (available <= 0) {
    return (
      <button
        disabled
        className="w-full rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-500 cursor-not-allowed"
      >
        Complet
      </button>
    );
  }

  return (
    <button
      onClick={handleReservation}
      disabled={isLoading}
      className="w-full rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50 disabled:cursor-wait"
    >
      {isLoading ? 'Réservation en cours...' : 'Réserver cette activité'}
    </button>
  );
} 