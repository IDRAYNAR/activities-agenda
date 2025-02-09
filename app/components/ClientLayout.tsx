'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { Session } from 'next-auth';

export default function ClientLayout({ 
  children, 
  session 
}: { 
  children: React.ReactNode;
  session: Session | null;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname}>
      <Navbar session={session} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 