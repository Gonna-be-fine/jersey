/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,vue}",
  ],
  theme: {
    extend: {
      colors: {
        darker: '#1d1d1d',
        dark: '#2c2c2c',
        primary: {
          DEFAULT: '#847630',
          light: '#9a8a3b',
          dark: '#6e6227'
        },
        secondary: {
          DEFAULT: '#ff7c31',
          light: '#ff9454',
          dark: '#e66422'
        },
        background: {
          DEFAULT: '#1a1a1a',
          light: '#2a2a2a',
          dark: '#1d1d1d'
        },
        text: {
          DEFAULT: '#ffffff',
          light: '#a0a0a0',
          dark: '#333333'
        }
      },
      fontFamily: {
        primary: ['Poppins', 'sans-serif'],
        secondary: ['Inter', 'sans-serif'],
        body: ['system-ui', 'sans-serif']
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        }
      }
    },
  },
  plugins: [],
}

