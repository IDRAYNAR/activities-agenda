import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const frenchNames = [
  { firstName: 'Lucas', lastName: 'Martin' },
  { firstName: 'Emma', lastName: 'Bernard' },
  { firstName: 'Gabriel', lastName: 'Dubois' },
  { firstName: 'Louise', lastName: 'Petit' },
  { firstName: 'Arthur', lastName: 'Moreau' },
  { firstName: 'Jade', lastName: 'Laurent' },
  { firstName: 'Louis', lastName: 'Garcia' },
  { firstName: 'Alice', lastName: 'Roux' },
  { firstName: 'Jules', lastName: 'Michel' },
  { firstName: 'Chloé', lastName: 'Leroy' },
  { firstName: 'Raphaël', lastName: 'Simon' },
  { firstName: 'Léa', lastName: 'Lefebvre' },
  { firstName: 'Hugo', lastName: 'Thomas' },
  { firstName: 'Manon', lastName: 'Durand' },
  { firstName: 'Paul', lastName: 'Robert' },
  { firstName: 'Sarah', lastName: 'Richard' },
  { firstName: 'Nathan', lastName: 'Lambert' },
  { firstName: 'Camille', lastName: 'Girard' },
  { firstName: 'Maxime', lastName: 'David' },
  { firstName: 'Inès', lastName: 'Bonnet' },
];

type ActivityData = {
  [key: string]: Array<{
    name: string;
    descriptions: string[];
  }>;
};

const activities: ActivityData = {
  Sport: [
    {
      name: 'Football à 5',
      descriptions: [
        'Match amical de foot à 5 sur terrain synthétique. Tous niveaux bienvenus !',
        'Venez vous défouler avec une partie de foot en petit groupe. Ambiance décontractée.',
        'Session de football à 5 entre amis. On cherche des joueurs pour compléter les équipes.'
      ]
    },
    {
      name: 'Yoga Flow',
      descriptions: [
        'Séance de yoga dynamique pour tous niveaux. Apportez votre tapis !',
        'Pratiquez le yoga dans une ambiance zen et bienveillante.',
        'Cours de yoga adapté à tous, débutants comme confirmés.'
      ]
    },
    {
      name: 'Course à pied',
      descriptions: [
        'Sortie running en groupe, parcours de 5-10km selon les niveaux.',
        'Footing matinal dans le parc. Rythme adapté à tous.',
        'Running entre passionnés. Venez comme vous êtes !'
      ]
    }
  ],
  'Bien-être': [
    {
      name: 'Méditation guidée',
      descriptions: [
        'Séance de méditation pour débutants. Apprenez à vous recentrer.',
        'Méditation en groupe pour évacuer le stress quotidien.',
        'Découvrez la méditation dans un cadre bienveillant.'
      ]
    },
    {
      name: 'Pilates',
      descriptions: [
        'Renforcement musculaire en douceur. Idéal pour le dos !',
        'Séance de Pilates tous niveaux. Venez muscler votre corps en profondeur.',
        'Cours de Pilates pour débutants. Ambiance décontractée.'
      ]
    }
  ],
  Education: [
    {
      name: 'Conversation anglaise',
      descriptions: [
        'Échangez en anglais autour d\'un café. Niveau intermédiaire requis.',
        'Pratiquez votre anglais dans une ambiance décontractée.',
        'Améliorez votre anglais à travers des discussions informelles.'
      ]
    },
    {
      name: 'Atelier d\'écriture',
      descriptions: [
        'Libérez votre créativité lors de cet atelier d\'écriture convivial.',
        'Venez écrire et partager vos textes dans une ambiance bienveillante.',
        'Atelier créatif pour développer votre style d\'écriture.'
      ]
    }
  ],
  Culture: [
    {
      name: 'Club de lecture',
      descriptions: [
        'Discussion autour du livre du mois. Rejoignez notre cercle de lecteurs !',
        'Partagez vos impressions de lecture dans une ambiance conviviale.',
        'Échangeons sur nos lectures dans un cadre décontracté.'
      ]
    },
    {
      name: 'Visite street art',
      descriptions: [
        'Découverte du street art dans le quartier. Appareil photo conseillé !',
        'Balade urbaine à la découverte des plus belles fresques de la ville.',
        'Explorez l\'art urbain avec un passionné du genre.'
      ]
    }
  ],
  Loisirs: [
    {
      name: 'Soirée jeux de société',
      descriptions: [
        'Venez découvrir de nouveaux jeux dans une ambiance conviviale.',
        'Soirée ludique autour des meilleurs jeux de société du moment.',
        'Party games et stratégie au programme de cette soirée fun !'
      ]
    },
    {
      name: 'Atelier photo',
      descriptions: [
        'Sortie photo en ville. Tous niveaux et tous appareils bienvenus !',
        'Apprenez les bases de la photo en pratiquant sur le terrain.',
        'Balade photographique pour capturer la ville sous son meilleur angle.'
      ]
    }
  ],
  Nature: [
    {
      name: 'Randonnée découverte',
      descriptions: [
        'Randonnée facile de 10km. Prévoir eau et en-cas.',
        'Balade nature à la découverte de la faune et flore locales.',
        'Escapade en pleine nature accessible à tous.'
      ]
    },
    {
      name: 'Jardinage collectif',
      descriptions: [
        'Entretien du jardin partagé. Conseils et convivialité au programme !',
        'Venez jardiner et échanger vos astuces entre passionnés.',
        'Initiation au jardinage bio. Outils fournis.'
      ]
    }
  ]
};

const locations = [
  {
    address: "15 Rue de la Paix, 75002 Paris",
    latitude: 48.8691,
    longitude: 2.3322
  },
  {
    address: "1 Place de l'Hôtel de Ville, 75004 Paris",
    latitude: 48.8566,
    longitude: 2.3522
  },
  {
    address: "82 Boulevard de Clichy, 75018 Paris",
    latitude: 48.8838,
    longitude: 2.3324
  },
  {
    address: "47 Rue des Francs Bourgeois, 75004 Paris",
    latitude: 48.8573,
    longitude: 2.3611
  },
  {
    address: "Place de la Bastille, 75011 Paris",
    latitude: 48.8532,
    longitude: 2.3698
  }
];

async function main() {
  // Création des types d'activités
  const activityTypes = [
    { name: 'Sport', description: 'Activités sportives et physiques' },
    { name: 'Bien-être', description: 'Yoga, méditation, relaxation' },
    { name: 'Education', description: 'Cours, ateliers, formations' },
    { name: 'Culture', description: 'Visites, expositions, spectacles' },
    { name: 'Loisirs', description: 'Jeux, divertissements' },
    { name: 'Nature', description: 'Randonnées, jardinage, découverte' },
  ];

  console.log('Création des types d\'activités...');
  const createdTypes = await Promise.all(
    activityTypes.map(type =>
      prisma.activityType.upsert({
        where: { name: type.name },
        update: {},
        create: type,
      })
    )
  );

  // Création des utilisateurs
  console.log('Création des utilisateurs...');
  const users = [];
  for (const name of frenchNames) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@example.com`,
        password: hashedPassword,
        firstName: name.firstName,
        lastName: name.lastName,
        role: 'USER',
      },
    });
    users.push(user);
  }

  // Création des activités
  console.log('Création des activités...');
  const createdActivities = [];

  for (const user of users) {
    const numActivities = Math.floor(Math.random() * 3) + 3; // 3 à 5 activités par utilisateur
    
    for (let i = 0; i < numActivities; i++) {
      const randomType = createdTypes[Math.floor(Math.random() * createdTypes.length)];
      const typeActivities = activities[randomType.name];
      const randomActivity = typeActivities[Math.floor(Math.random() * typeActivities.length)];
      
      // Génère une date aléatoire dans les 3 prochains mois
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + Math.floor(Math.random() * 90));
      // Ajuste l'heure entre 8h et 20h
      startTime.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 4) * 15, 0);
      
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const activity = await prisma.activity.create({
        data: {
          name: `${randomActivity.name} avec ${user.firstName}`,
          description: randomActivity.descriptions[Math.floor(Math.random() * randomActivity.descriptions.length)],
          typeId: randomType.id,
          startTime,
          duration: [45, 60, 90, 120][Math.floor(Math.random() * 4)],
          available: Math.floor(Math.random() * 10) + 5, // 5 à 15 places
          organizerId: user.id,
          address: randomLocation.address,
          latitude: randomLocation.latitude,
          longitude: randomLocation.longitude,
        },
      });
      createdActivities.push(activity);
    }
  }

  console.log(`Base de données initialisée avec :
    - ${createdTypes.length} types d'activités
    - ${users.length} utilisateurs
    - ${createdActivities.length} activités`);
}

main()
  .catch((e) => {
    console.error('Erreur lors de l\'initialisation de la base de données:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });