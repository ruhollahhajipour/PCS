import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isVercelPreviewBuild =
    process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF ===
        "preview/pcs-auth-bypass-2026-10-31";

const isGitHubPagesPreviewBuild =
    process.env.PCS_PREVIEW_AUTH_BYPASS === "true" &&
    process.env.GITHUB_ACTIONS === "true" &&
    process.env.GITHUB_REF_NAME ===
        "preview/pcs-auth-bypass-2026-10-31";

const isPcsPreviewBuild =
    isVercelPreviewBuild || isGitHubPagesPreviewBuild;

const isGitHubPagesBuild =
    process.env.PCS_GITHUB_PAGES === "true" &&
    isGitHubPagesPreviewBuild;

export default defineConfig({
    base: isGitHubPagesBuild ? "/PCS/" : "/",

    plugins: [react()],

    define: {
        __PCS_PREVIEW_AUTH_BYPASS__: JSON.stringify(isPcsPreviewBuild),
    },

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
            "/api": {
                target: "http://localhost:5201",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
