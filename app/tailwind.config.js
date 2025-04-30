/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bgc: '#262626',
        on_bgc: '#FFFFFF',
        on_bgc_icon: '#636363',
        surface: '#343437',
        on_surface: '#FFFFFF',
        border: '#000000',
        on_bgc_gray: '#929292',
        bgc_img: '#6060604D',
        input: '#FFFFFF',
      },
    },
  },
  plugins: [],
}

