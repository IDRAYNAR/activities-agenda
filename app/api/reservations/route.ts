import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { activityId } = await request.json();

    if (!activityId) {
      return NextResponse.json({ error: 'ID d\'activité manquant' }, { status: 400 });
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return NextResponse.json({ error: 'Activité non trouvée' }, { status: 404 });
    }

    if (activity.available <= 0) {
      return NextResponse.json({ error: 'Plus de places disponibles' }, { status: 400 });
    }

    // Vérifier si l'utilisateur n'est pas déjà inscrit
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        activityId,
        user: {
          email: session.user.email
        }
      }
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit à cette activité' },
        { status: 400 }
      );
    }

    // Créer la réservation et mettre à jour le nombre de places disponibles
    await prisma.$transaction([
      prisma.reservation.create({
        data: {
          activity: { connect: { id: activityId } },
          user: { connect: { email: session.user.email } }
        }
      }),
      prisma.activity.update({
        where: { id: activityId },
        data: { available: { decrement: 1 } }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réservation' },
      { status: 500 }
    );
  }
} 