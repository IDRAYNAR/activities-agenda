import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    const params = await context.params;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const activityId = parseInt(params.id);
    
    // Vérifier que l'activité existe et appartient à l'utilisateur
    const activity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        organizer: {
          email: session.user.email
        }
      }
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activité non trouvée ou non autorisée' },
        { status: 404 }
      );
    }

    // Supprimer l'activité et ses réservations (cascade)
    await prisma.activity.delete({
      where: { id: activityId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'activité:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    const params = await context.params;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const activityId = parseInt(params.id);
    const data = await request.json();
    
    // Vérifier que l'activité existe et appartient à l'utilisateur
    const activity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        organizer: {
          email: session.user.email
        }
      }
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activité non trouvée ou non autorisée' },
        { status: 404 }
      );
    }

    // Mettre à jour l'activité avec seulement les champs autorisés
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        description: data.description,
        duration: parseInt(data.duration),
        available: parseInt(data.available)
      }
    });

    return NextResponse.json(updatedActivity);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'activité:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour' },
      { status: 500 }
    );
  }
} 