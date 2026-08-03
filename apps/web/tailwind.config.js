/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1420',
        surface: '#161D2B',
        'surface-hover': '#1D2536',
        border: '#262F42',
        ash: '#8A93A6',
        chalk: '#E8ECF3',
        amber: '#F2A93B',
        active: '#4FD1A5',
        paused: '#8A93A6',
        archived: '#5B6376',
        alert: '#EF6461',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
