import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "library_web",
      filename: "remoteEntry.js",
      exposes: {
        './App': './src/App',
      },
      remotes: {
        container: 'http://localhost:5173/assets/remoteEntry.js',
      },
      shared: [
        "react",
        "react-icons",
        "react-dom",
        "zustand",
        "react-router-dom"
      ], 
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    host: "localhost",
    port: 3001,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});