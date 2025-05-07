import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "player_web",
      filename: "remoteEntry.js",
      exposes: {
        
      },
      shared: {
        "react": {
          singleton: true,
          requiredVersion: "^19.1.0",
        },
        "react-icons": {
          singleton: true,
          requiredVersion: "^5.5.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.1.0",
        },
        "jotai": {
          singleton: true,
          requiredVersion: "^2.12.4",
        },
      }, 
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    host: "localhost",
    port: 3002,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});