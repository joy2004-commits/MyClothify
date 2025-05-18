/** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./src/**/*.{html,ts}",
     ],
     theme: {
       extend: {
         colors: {
           'beige': '#F5F5DC', // Beige for background
           'khaki': '#C3B091', // Khaki for accents
           'dark-khaki': '#8B7D6B', // Darker khaki for text/buttons
         },
       },
     },
     plugins: [],
   }