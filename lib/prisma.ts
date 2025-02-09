import { PrismaClient } from '@prisma/client'

// Client Prisma pour la connexion à la base de données
// Utilisation du pattern Singleton pour éviter les connexions multiples
const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  // Déclaration globale pour TypeScript
  // eslint-disable-next-line no-var
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined
}

// Export de l'instance Prisma (réutilise l'instance globale en développement)
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// En développement, on garde l'instance en variable globale pour le hot reload
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
