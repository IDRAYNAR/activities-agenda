import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les statistiques
    const [
      totalUsers,
      totalActivities,
      totalReservations,
      activeReservations,
      topActivities,
      recentReservations
    ] = await Promise.all([
      // Nombre total d'utilisateurs
      prisma.user.count(),
      
      // Nombre total d'activités
      prisma.activity.count(),
      
      // Nombre total de réservations
      prisma.reservation.count(),
      
      // Nombre de réservations actives
      prisma.reservation.count({
        where: { status: "CONFIRMED" }
      }),
      
      // Top 5 des activités les plus réservées
      prisma.activity.findMany({
        take: 5,
        include: {
          _count: {
            select: { reservations: true }
          }
        },
        orderBy: {
          reservations: {
            _count: 'desc'
          }
        }
      }),
      
      // 5 dernières réservations
      prisma.reservation.findMany({
        take: 5,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          activity: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalActivities,
        totalReservations,
        activeReservations,
        reservationRate: totalActivities > 0 
          ? (activeReservations / totalActivities) * 100 
          : 0,
      },
      topActivities: topActivities.map(activity => ({
        id: activity.id,
        name: activity.name,
        reservationCount: activity._count.reservations
      })),
      recentReservations: recentReservations.map(reservation => ({
        id: reservation.id,
        activityName: reservation.activity.name,
        userName: `${reservation.user.firstName} ${reservation.user.lastName}`,
        userEmail: reservation.user.email,
        date: reservation.createdAt
      }))
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
} 