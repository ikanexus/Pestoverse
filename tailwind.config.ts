import type { Config } from "tailwindcss";

export default {
    content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./plugins/**/*.{js,ts}", "./nuxt.config.{js,ts}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "#2B303B",
                navigation: "#16181D",
                italygreen: "#008D44",
                italyred: "#D0323D",
            },

            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },

            spacing: {
                "128": "32rem",
            },

            zIndex: {
                500: "500",
            },

            keyframes: (theme) => ({
                scalein: {
                    "0%": { transform: "scale(1.0)" },
                    "100%": { transform: "scale(2.0)" },
                },
                sunfire: {
                    from: { boxShadow: "0 0 50px var(--tw-gradient-to-color)" },
                    to: { boxShadow: "0 0 100px var(--tw-gradient-from-color)" },
                },
                orbit: {
                    from: { transform: "rotate(var(--start-rotation))" },
                    to: { transform: "rotate(calc(var(--start-rotation) + 360deg))" },
                },
            }),

            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },

            animation: {
                "spin-slow": "spin 60s linear infinite",
                orbit: "orbit var(--rotation-speed) infinite linear",
            },
        },
    },
} satisfies Config;
