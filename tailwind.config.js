/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#6C5DD3',
          coral: '#FF6B6B',
          warm: '#FF8563',
        },
        neutral: {
          white: '#FDFCFB',
          bg: '#FAFAFA',
          dark: '#1A1A1D',
          text: '#2D2D2D',
          secondary: '#6C6C6C',
          light: '#EAEAEA',
        },
        mood: {
          happy: '#FFE066',
          sad: '#6C91BF',
          anxious: '#FFB5B5',
          creative: '#A29BFE',
          motivated: '#55EFC4',
          focus: '#6C5DD3',
          chill: '#70D6FF',
          relax: '#E8E8E8',
          explorer: '#00C897',
          reflective: '#9B5DE5',
        },
        'bg-mood-happy': '#FFE066',
        'bg-mood-sad': '#6C91BF',
        'bg-mood-anxious': '#FFB5B5',
        'bg-mood-creative': '#A29BFE',
        'bg-mood-motivated': '#55EFC4',
        'bg-mood-focus': '#6C5DD3',
        'bg-mood-chill': '#70D6FF',
        'bg-mood-relax': '#E8E8E8',
        'bg-mood-explorer': '#00C897',
        'bg-mood-reflective': '#9B5DE5',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      boxShadow: {
        'mood-happy': '0 4px 20px rgba(255, 224, 102, 0.4)',
        'mood-creative': '0 4px 20px rgba(162, 155, 254, 0.4)',
        'mood-motivated': '0 4px 20px rgba(85, 239, 196, 0.4)',
        'mood-focus': '0 4px 20px rgba(108, 93, 211, 0.4)',
        'mood-chill': '0 4px 20px rgba(112, 214, 255, 0.4)',
        'mood-sad': '0 4px 20px rgba(108, 145, 191, 0.4)',
        'mood-anxious': '0 4px 20px rgba(255, 181, 181, 0.4)',
        'mood-reflective': '0 4px 20px rgba(155, 93, 229, 0.4)',
        'mood-explorer': '0 4px 20px rgba(0, 200, 151, 0.4)',
        'mood-relax': '0 4px 20px rgba(232, 232, 232, 0.4)',
        'primary': '0 4px 20px rgba(108, 93, 211, 0.3)',
        'mood-sad': '0 4px 20px rgba(108, 145, 191, 0.4)',
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out',
        'stagger': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}