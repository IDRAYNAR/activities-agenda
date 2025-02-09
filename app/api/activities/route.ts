import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Récupérer l'utilisateur à partir de l'email de la session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

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
        description: data.description || '',
        typeId: parseInt(data.typeId),
        startTime: new Date(data.startTime),
        duration: parseInt(data.duration),
        available: parseInt(data.available),
        address: data.address || '',
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        organizerId: user.id,
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const type = searchParams.get('type');
    const skip = (page - 1) * limit;

    // Construire la requête de base
    const where = {
      AND: [
        // Condition de recherche par nom ou description si query existe
        query ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
            { description: { contains: query, mode: 'insensitive' as Prisma.QueryMode } }
          ]
        } : {},
        // Filtre par type si spécifié
        type ? { typeId: parseInt(type) } : {}
      ]
    };

    // Récupérer les activités avec pagination et filtres
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          startTime: 'asc'
        },
        include: {
          type: true,
          organizer: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          reservations: {
            select: {
              id: true
            }
          },
          _count: {
            select: {
              reservations: true
            }
          }
        }
      }),
      prisma.activity.count({ where })
    ]);

    return NextResponse.json({
      activities,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des activités' },
      { status: 500 }
    );
  }
} 