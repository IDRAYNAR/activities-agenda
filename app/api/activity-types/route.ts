import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const types = await prisma.activityType.findMany();
    return NextResponse.json(types);
  } catch (error) {
    console.error('Erreur lors de la récupération des types:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des types' },
      { status: 500 }
    );
  }
} 