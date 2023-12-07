import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true,
    },

    modules: ["@nuxt/devtools", "@nuxt/image", "@nuxthq/ui", "nuxt-icon", "@nuxt/content", "@nuxtjs/google-fonts"],

    css: ["~/assets/css/index.css"],

    ui: {
        icons: ["heroicons", "mdi"],
    },

    alias: {
        static: fileURLToPath(new URL("./static", import.meta.url)),
    },

    colorMode: {
        preference: "dark",
        fallback: "dark",
        classSuffix: "",
    },

    image: {
        none: {},
        dir: "static/images",
    },

    runtimeConfig: {
        public: {
            cdnBase: "https://cdn.pestoverse.world",
        },
    },

    googleFonts: {
        useStylesheet: true,
        families: {
            Poppins: [400, 500, 600, 700],
        },
    },
    // build: {
    //     transpile: ["@jsquash/png", "@jsquash/jpeg", "@jsquash/webp", "@jsquash/resize"],
    // },
    // vite: {
    //     optimizeDeps: {
    //         exclude: ["@jsquash/png", "@jsquash/jpeg", "@jsquash/webp", "@jsquash/resize"],
    //     },
    // },
    nitro: {
        experimental: {
            wasm: true,
        },
    },
});
