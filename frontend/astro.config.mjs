// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    env: {
        schema: {
            BACKEND_URL: envField.string({
                context: "client",
                access: "public",
            }),
        },
    },

    integrations: [react()],
});
