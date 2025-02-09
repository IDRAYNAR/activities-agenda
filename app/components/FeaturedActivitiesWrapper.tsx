'use client';

import dynamic from 'next/dynamic';

const FeaturedActivities = dynamic(
  () => import('./FeaturedActivities').then(mod => mod.FeaturedActivities),
  { ssr: false }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FeaturedActivitiesWrapper({ activities }: { activities: any }) {
  return <FeaturedActivities activities={activities} />;
} 