import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const activityId = parseInt(params.activityId);

    if (isNaN(activityId)) {
      return NextResponse.json({ error: 'ID d\'activité invalide' }, { status: 400 });
    }

    // Vérifier si la réservation existe
    const reservation = await prisma.reservation.findFirst({
      where: {
        activityId,
        user: {
          email: session.user.email
        }
      }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la réservation et mettre à jour le nombre de places disponibles
    await prisma.$transaction([
      prisma.reservation.delete({
        where: {
          id: reservation.id
        }
      }),
      prisma.activity.update({
        where: { id: activityId },
        data: { available: { increment: 1 } }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation de la réservation' },
      { status: 500 }
    );
  }
} 