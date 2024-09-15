/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        canela: ['Canela', 'Times New Roman', 'serif'],
        karla: ['Karla', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        // Add a smaller font size for Helvetica fallback if needed
        'smaller': ['0.875rem', '1.25rem'], // Example for reducing text size
      },
      colors:{
        "dark-blue":"#140144",
        "aqua":"#29e6c0",
        "forrest-green":"#0a4a57",
        "grey":"#4f759b",
        "light-grey":"#dfeaf2",
      }
    },
  },
  plugins: [],
}

