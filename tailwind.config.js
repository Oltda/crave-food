module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {

    extend: {
      backgroundImage: {
        'header-picture': "url('/static/images/Foodies.jpg/')",
      },
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
    
  
  ],
}
