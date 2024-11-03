/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['monospace', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

