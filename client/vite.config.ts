import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const env = loadEnv("all", process.cwd());

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      $fonts: mode === "dev" ? "../fonts" : "./public/fonts",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: `http://${env.VITE_DOMAIN}`,
      },
    },
  },
}));
