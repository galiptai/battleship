import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const env = loadEnv("all", process.cwd());

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      $fonts: mode === "development" ? "../fonts" : "./public/fonts",
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
