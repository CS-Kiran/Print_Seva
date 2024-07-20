/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        movePendulum: "movePendulum 7s infinite",
        wiggle: 'wiggle 1.5s ease-in-out infinite',
        horizontalBounce: "horizontalBounce 1s infinite",
        fadeIn: 'fadeIn 1s ease-out',
        fadeOut: 'fadeOut 1s ease-out',
        scaleUp: 'scaleUp 1s ease-out',
        rotate: 'rotate 4s linear infinite',
        colorChange: 'colorChange 1s ease-out',
      },
      keyframes: {
        movePendulum: {
          "0%": {
            transform: "translateX(-50%) rotate(-10deg)",
          },
          "50%": {
            transform: "translateX(50%) rotate(10deg)",
          },
          "100%": {
            transform: "translateX(-50%) rotate(-10deg)",
          },
        },

        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },

        horizontalBounce: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-10px)" },
        },

        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        colorChange: {
          '0%': { color: '#000' },
          '100%': { color: '#ff6347' }, 
        },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require("daisyui"),
  ],
  daisyui: {
    themes: ["winter"],
  },
};
