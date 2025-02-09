'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ActivityType } from '@prisma/client';

export function ActivityFilters({ types }: { types: ActivityType[] }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (typeId: string | number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (typeId === 'all') {
      params.delete('type');
    } else {
      params.set('type', typeId.toString());
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => handleFilterChange('all')}
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          !searchParams?.get('type')
            ? 'bg-violet-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Toutes
      </button>
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => handleFilterChange(type.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
            searchParams?.get('type') === type.id.toString()
              ? 'bg-violet-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {type.name}
        </button>
      ))}
    </div>
  );
} 