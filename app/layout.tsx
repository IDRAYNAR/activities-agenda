import { Inter, Outfit } from 'next/font/google';
import "./globals.css";
import Providers from "./components/Providers";
import Navbar from "./components/Navbar";
import 'leaflet/dist/leaflet.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Activiz',
  description: 'Découvrez et réservez des activités sportives, culturelles et de loisirs près de chez vous',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
