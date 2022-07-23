module.exports = {
  // purge: {
    content: [
      './public/**/*.html',
      './src/**/*.{js,jsx,ts,tsx}'
    ],
    // options: {
    //   safelist: {
    //     standard: [
    //       /navien-blue-light$/, 
    //       /navien-orange$/, 
    //       /navien-gray-dark$/, 
    //     ]
    //   },
    // },
  // },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend:{},
    colors: {
      navien: {
        blue: {
          light: '#1f57cb', // navienapp mobile theme primary.500
          DEFAULT: '#0E3173', // navienapp mobile theme primary.700
          dark: '#051d46', // navienapp mobile theme primary.800
        },
        orange: {
          light: '#',
          DEFAULT: '#FF730F',
          dark: '#',
        },
        gray: {
          light: '#e5e7eb', // nativebase coolGray.200
          DEFAULT: '#6b7280', // nativebase coolGray.500
          dark: '#1f2937' // nativebase coolGray.800
        }
      }
    },
    fill: theme => theme('colors')
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
