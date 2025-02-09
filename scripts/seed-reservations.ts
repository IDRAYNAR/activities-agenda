const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const activities = await prisma.activity.findMany();
  const users = await prisma.user.findMany({
    where: {
      role: 'USER'
    }
  });

  console.log('Création des réservations...');
  for (const activity of activities) {
    // Générer un nombre aléatoire de réservations entre 1 et 5
    const numReservations = Math.floor(Math.random() * 5) + 1;
    
    // Sélectionner aléatoirement des utilisateurs pour les réservations
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    const selectedUsers = shuffledUsers.slice(0, numReservations);

    console.log(`Ajout de ${numReservations} réservations pour l'activité "${activity.name}"`);

    // Créer les réservations
    for (const user of selectedUsers) {
      await prisma.reservation.create({
        data: {
          activityId: activity.id,
          userId: user.id,
          status: 'CONFIRMED',
        },
      });
    }

    // Mettre à jour le nombre de places disponibles
    await prisma.activity.update({
      where: { id: activity.id },
      data: {
        available: {
          decrement: numReservations
        }
      }
    });
  }

  console.log('Réservations créées avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors de la création des réservations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 