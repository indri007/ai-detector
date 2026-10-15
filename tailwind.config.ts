import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        surface: "var(--bg-surface)",
        panel: "var(--bg-panel)",
        academic: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        diagnostic: {
          error: {
            text: "var(--diagnostic-error-text)",
            bg: "var(--diagnostic-error-bg)",
            border: "var(--diagnostic-error-border)",
            line: "var(--diagnostic-error-line)",
          },
          similarity: {
            text: "var(--diagnostic-sim-text)",
            bg: "var(--diagnostic-sim-bg)",
            border: "var(--diagnostic-sim-border)",
            line: "var(--diagnostic-sim-line)",
          },
          style: {
            text: "var(--diagnostic-style-text)",
            bg: "var(--diagnostic-style-bg)",
            border: "var(--diagnostic-style-border)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
