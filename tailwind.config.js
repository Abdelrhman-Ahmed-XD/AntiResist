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
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}


