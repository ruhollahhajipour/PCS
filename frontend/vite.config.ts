import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    resolve: {
        extensions: [
            ".mjs",
            ".ts",
            ".tsx",
            ".js",
            ".jsx",
            ".json",
        ],
    },

    server: {
        port: 5173,

        proxy: {
            "/health": {
                target: "http://localhost:5201",
                changeOrigin: true,
                secure: false,
            },
            "/api": {
                target: "http://localhost:5201",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});