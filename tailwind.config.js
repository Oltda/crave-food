module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {

    extend: {
      backgroundImage: {
        'header-picture': "url('/static/images/foodies.jpg/')",
      },
      minWidth: {
        '400': '400px',
      },
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
    
  
  ],
}
