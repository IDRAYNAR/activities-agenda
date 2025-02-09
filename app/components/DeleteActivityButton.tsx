'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeleteActivityButtonProps = {
  activityId: number;
  children: React.ReactNode;
  className?: string;
};

export function DeleteActivityButton({ activityId, children, className }: DeleteActivityButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Une erreur est survenue');
      }

      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className={className}
    >
      {children}
    </button>
  );
} 