'use client';

import dynamic from 'next/dynamic';
import { MapPinIcon } from '@heroicons/react/24/outline';

const ActivityMap = dynamic(() => import('@/app/components/ActivityMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-100 rounded-lg animate-pulse" />
  ),
});

interface ActivityMapSectionProps {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

export function ActivityMapSection(props: ActivityMapSectionProps) {
  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex items-center mb-4">
        <MapPinIcon className="h-5 w-5 text-gray-400" />
        <span className="ml-2 text-gray-700">{props.address}</span>
      </div>
      <ActivityMap {...props} />
    </div>
  );
} 