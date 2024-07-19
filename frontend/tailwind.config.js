/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        movePendulum: "movePendulum 7s infinite",
        wiggle: 'wiggle 1.5s ease-in-out infinite',
        horizontalBounce: "horizontalBounce 1s infinite",
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
