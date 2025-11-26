module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "infinite-scroll-slow": "infinite-scroll-slow 40s linear infinite",
      },
      keyframes: {
        "infinite-scroll-slow": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};