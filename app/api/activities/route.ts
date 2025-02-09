import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validation des données
    if (!data.name || !data.typeId || !data.startTime || !data.duration || !data.available) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        name: data.name,
        description: data.description,
        typeId: data.typeId,
        startTime: new Date(data.startTime),
        duration: parseInt(data.duration),
        available: parseInt(data.available),
        organizerId: session.user.id,
      },
      include: {
        type: true,
        organizer: true,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de l\'activité' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        type: true,
        reservations: true,
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des activités' },
      { status: 500 }
    );
  }
} 