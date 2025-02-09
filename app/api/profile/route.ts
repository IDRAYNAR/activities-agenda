import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { firstName, lastName, email, currentPassword, newPassword } = data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const updateData: {
      firstName: string;
      lastName: string;
      email: string;
      password?: string;
    } = {
      firstName,
      lastName,
      email,
    };

    if (newPassword && currentPassword) {
      const isValidPassword = await compare(currentPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
      }
      updateData.password = await hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      },
    });
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Supprimer d'abord les dépendances de l'utilisateur
    await prisma.$transaction([
      // Supprimer les réservations de l'utilisateur
      prisma.reservation.deleteMany({
        where: {
          user: {
            email: session.user.email
          }
        }
      }),
      // Supprimer les activités organisées par l'utilisateur
      prisma.activity.deleteMany({
        where: {
          organizer: {
            email: session.user.email
          }
        }
      }),
      // Enfin, supprimer l'utilisateur
      prisma.user.delete({
        where: { email: session.user.email }
      })
    ]);

    return NextResponse.json({ message: "Compte supprimé avec succès" });
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression du compte:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression du compte" },
      { status: 500 }
    );
  }
} 