import { Inter } from 'next/font/google';
import "./globals.css";
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import ClientLayout from './components/ClientLayout';
import Providers from './components/Providers';
import 'leaflet/dist/leaflet.css';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Activities Agenda',
  description: 'Plateforme de réservation d\'activités',
  other: {
    'Cache-Control': 'public, max-age=3600'
  }
};

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning={true}>
        <Providers session={session}>
          <ClientLayout session={session}>
            {children}
          </ClientLayout>
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
