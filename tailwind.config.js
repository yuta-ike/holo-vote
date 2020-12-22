module.exports = {
  purge: ['./pages/**/*.tsx', './view/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    extend: {
      fontFamily: {
        'sans': ["'M PLUS Rounded 1c'", 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'emphasis': ["'M PLUS Rounded 1c'"]
      },
      colors: {
        black: {
          DEFAULT: '#333333',
        },
        twitter: {
          DEFAULT: '#55acee',
        },
        primary: {
          DEFAULT: 'rgb(116, 207, 226)',
            light: 'rgb(41, 197, 252)',
        },
        secondary: {
          DEFAULT: 'rgb(255 125 33)',
        }
      },
      letterSpacing: {
        widest: '.15em',
      },
    },
  },
  variants: {
    extend: {
      outline: ['focus-visible'],
      boxShadow: ['focus-visible', 'active', 'disabled'],
      transform: ['focus-visible', 'active', 'disabled'],
      scale: ['focus-visible', 'active', 'disabled'],
      cursor: ['focus-visible', 'active', 'disabled'],
      letterSpacing: ['hover'],
    },
  },
  plugins: [],
}
