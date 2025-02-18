/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Sử dụng class strategy cho dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          bg: '#1a1a1a',
          'bg-secondary': '#2d2d2d',
          'text-primary': '#ffffff',
          'text-secondary': '#a0a0a0',
        },
      },
      backgroundColor: {
        dark: '#1a1a1a',
        light: '#ffffff',
      },
      textColor: {
        dark: '#ffffff',
        light: '#000000',
      },
    },
  },
  plugins: [],
}