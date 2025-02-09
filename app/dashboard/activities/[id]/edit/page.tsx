import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ActivityForm } from '@/app/components/ActivityForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditActivityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const [activity, types] = await Promise.all([
    prisma.activity.findFirst({
      where: {
        id: parseInt(resolvedParams.id),
        organizer: {
          email: session.user.email
        }
      }
    }),
    prisma.activityType.findMany()
  ]);

  if (!activity) {
    redirect('/dashboard/activities');
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/dashboard/activities"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour à mes activités
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Modifier l&apos;activité
          </h3>
          <ActivityForm types={types} activity={activity} />
        </div>
      </div>
    </div>
  );
} 