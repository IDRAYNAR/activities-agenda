// Configuration de Tailwind CSS
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Définition des fichiers à analyser pour les classes Tailwind
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Configuration des polices personnalisées
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui'],
        display: ['var(--font-outfit)', 'system-ui'],
      },
      // Palette de couleurs personnalisée
      colors: {
        violet: {
          50: '#f5f3ff',  // Très clair
          100: '#ede9fe', // Extra clair
          200: '#ddd6fe', // Plus clair
          300: '#c4b5fd', // Clair
          400: '#a78bfa', // Moyen clair
          500: '#8b5cf6', // Base
          600: '#7c3aed', // Moyen foncé
          700: '#6d28d9', // Foncé
          800: '#5b21b6', // Plus foncé
          900: '#4c1d95', // Très foncé
        },
      },
    },
  },
  // Plugins Tailwind utilisés
  plugins: [
    // Plugin pour les formulaires stylisés
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/forms'),
  ],
}; 