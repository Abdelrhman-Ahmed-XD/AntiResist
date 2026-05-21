/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   "#2E5BFF",
        teal:      "#00C2A8",
        bg:        "#F8FAFC",
        dark:      "#1A2233",
        secondary: "#6B7280",
        success:   "#10B981",
        danger:    "#EF4444",
        // Portal neon design tokens (from ui-ux-pro-max Gaming palette)
        void:           "#050510",
        "neon-purple":  "#8A2BE2",
        "neon-indigo":  "#4F46E5",
        "neon-violet":  "#7C3AED",
        "neon-glow":    "#A855F7",
        "portal-card":  "#1E1C35",
        "portal-border":"#4C1D95",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "float":           "portalFloat 5.5s ease-in-out infinite",
        "float-slow":      "portalFloat 8s ease-in-out infinite",
        "float-delayed":   "portalFloat 6s ease-in-out 2s infinite",
        "float-delayed2":  "portalFloat 7s ease-in-out 4s infinite",
        "glow-pulse":      "glowPulse 3s ease-in-out infinite",
        "blob":            "blob 9s ease-in-out infinite",
        "blob-delayed":    "blob 12s ease-in-out 3s infinite",
        "blob-delayed2":   "blob 10s ease-in-out 6s infinite",
        "shimmer":         "shimmer 2.5s linear infinite",
        "count-up":        "countUp 0.6s ease-out forwards",
        "slide-up":        "slideUp 0.5s ease-out forwards",
        "fade-in":         "fadeIn 0.4s ease-out forwards",
        "spin-slow":       "spin 25s linear infinite",
        "ping-slow":       "ping 3s cubic-bezier(0,0,0.2,1) infinite",
      },
      keyframes: {
        portalFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-18px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5", filter: "blur(20px)" },
          "50%":      { opacity: "1",   filter: "blur(30px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%":      { transform: "translate(25px,-25px) scale(1.06)" },
          "66%":      { transform: "translate(-20px,18px) scale(0.95)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center"  },
        },
        countUp: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        "neon":    "0 0 15px rgba(138,43,226,0.5), 0 0 30px rgba(138,43,226,0.2)",
        "neon-lg": "0 0 30px rgba(138,43,226,0.7), 0 0 60px rgba(138,43,226,0.3), 0 0 90px rgba(138,43,226,0.1)",
        "neon-sm": "0 0 8px rgba(138,43,226,0.4)",
        "neon-red":"0 0 20px rgba(239,68,68,0.6)",
        "neon-yellow":"0 0 20px rgba(234,179,8,0.5)",
        "neon-green":"0 0 20px rgba(34,197,94,0.5)",
        "card-glow":"0 0 0 1px rgba(138,43,226,0.3), 0 8px 32px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
}


