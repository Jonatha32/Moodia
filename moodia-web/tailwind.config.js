/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales de Moodia
        primary: {
          purple: '#7B5BFF',
          pink: '#FF5E9C',
          orange: '#FFAB5E',
        },
        // Neutrales
        neutral: {
          white: '#FAFAFA',
          navy: '#1E1E2F',
          light: '#F0F0F5',
          medium: '#C3C3D1',
          dark: '#4A4A6A',
        },
        // Colores por mood
        mood: {
          focus: '#3A86FF',
          creative: '#FF5E9C',
          explorer: '#00C897',
          reflective: '#9B5DE5',
          chill: '#70D6FF',
          relax: '#D3D3E7',
          motivated: '#FF6B6B',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '24px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7B5BFF 0%, #FF5E9C 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFAB5E 0%, #FF5E9C 100%)',
      },
    },
  },
  plugins: [],
}