/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        movePendulum: 'movePendulum 7s infinite',
      },
      keyframes: {
        movePendulum: {
          '0%': {
            transform: 'translateX(-50%) rotate(-10deg)',
          },
          '50%': {
            transform: 'translateX(50%) rotate(10deg)',
          },
          '100%': {
            transform: 'translateX(-50%) rotate(-10deg)',
          },
        },
      },
    },
  },
  plugins: [],
};
