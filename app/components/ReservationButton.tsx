// Composant de bouton de réservation
// Gère l'état et la logique de réservation d'une activité
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Interface pour les props du composant
type ReservationButtonProps = {
  activityId: number;
  available: number;
  isRegistered: boolean;
};

export function ReservationButton({ activityId, available, isRegistered }: ReservationButtonProps) {
  // État local pour gérer le chargement
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();

  // Gestion de la réservation
  const handleReservation = async () => {
    // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      // Appel à l'API pour créer la réservation
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

      // Rafraîchissement de la page pour afficher la mise à jour
      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  // Affichage si l'utilisateur est déjà inscrit
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

  // Affichage si l'activité est complète
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

  // Bouton de réservation standard
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