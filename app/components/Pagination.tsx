'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export function Pagination({
  totalItems,
  itemsPerPage = 9,
}: {
  totalItems: number;
  itemsPerPage?: number;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => replace(createPageURL(currentPage - 1))}
          disabled={currentPage <= 1}
          className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            currentPage <= 1
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Précédent
        </button>
        <button
          onClick={() => replace(createPageURL(currentPage + 1))}
          disabled={currentPage >= totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            currentPage >= totalPages
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Suivant
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Affichage de{' '}
            <span className="font-medium">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
            </span>{' '}
            à{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            sur <span className="font-medium">{totalItems}</span> résultats
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => replace(createPageURL(currentPage - 1))}
              disabled={currentPage <= 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                currentPage <= 1
                  ? 'cursor-not-allowed bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Précédent</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => replace(createPageURL(currentPage + 1))}
              disabled={currentPage >= totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                currentPage >= totalPages
                  ? 'cursor-not-allowed bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Suivant</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 