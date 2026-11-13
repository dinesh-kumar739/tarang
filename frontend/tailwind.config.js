export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#1E1B4B",
        "sidebar-hover": "#312E81",
        primary: "#6366F1",
        "primary-dark": "#4F46E5",
        accent: "#A78BFA",
        canvas: "#F5F3FF",
        line: "#DDD6FE",
        ink: "#1E1B4B",
        online: "#10B981",
      },
      keyframes: {
        waveSlide: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        ringPulse: {
          "0%": { transform: "scale(1)", opacity: "0.45" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
      },
      animation: {
        "wave-slow": "waveSlide 22s linear infinite",
        "wave-mid": "waveSlide 15s linear infinite",
        "wave-fast": "waveSlide 10s linear infinite",
        "ring-pulse": "ringPulse 3s ease-out infinite",
      },
    },
  },
  plugins: [],
};