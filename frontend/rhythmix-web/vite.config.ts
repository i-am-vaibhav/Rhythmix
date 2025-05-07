import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
      react(),
      federation({
        name: "container",
        remotes: {
          home_web: "http://localhost:3000/assets/remoteEntry.js",
          library_web: "http://localhost:3001/assets/remoteEntry.js",
          player_web: "http://localhost:3002/assets/remoteEntry.js",
        },
        shared: {
          "react": {
            singleton: true,
            requiredVersion: "^19.1.0",
          },
          "react-dom": {
            singleton: true,
            requiredVersion: "^19.1.0",
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: "^6.0.0",
          },
          "jotai": {
            singleton: true,
            requiredVersion: "^2.12.4",
          },
          "react-icons": {
            singleton: true,
            requiredVersion: "^5.5.0",
          }
        },      
      }),
    ],
    build: {
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
})
