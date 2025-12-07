import animate from "tailwindcss-animate";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounceScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.5)' },
        },
      },
      animation: {
        'bounce-scale': 'bounceScale 1.5s infinite',
      },
    },
  },
  plugins: [animate],
};