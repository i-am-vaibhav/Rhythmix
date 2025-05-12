import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
      react(),
      federation({
        name: "container",
        filename: "remoteEntry.js",
        remotes: {
          home_web: "http://localhost:3002/assets/remoteEntry.js",
          library_web: "http://localhost:3001/assets/remoteEntry.js",
          player_web: "http://localhost:3000/assets/remoteEntry.js",
        },
        exposes: {
          "./AuthStore": "./src/store/authStore.ts",
          "./MockedMusic": "./src/store/mockedMusic.ts",
          "./musicPlayer": "./src/store/musicPlayer.ts",
        },
        shared: {
          "react": {
            version: "^19.1.0",
          },
          "react-dom": {
            version: "^19.1.0",
          },
          "react-router-dom": {
            version: "^7.5.3",
          },
          "zustand": {
            version: "^5.0.4",
          },
          "react-icons": {
            version: "^5.5.0",
          },
          "react-bootstrap":{
            version: "^2.10.9"
          },
          "bootstrap":{
            version:"^5.3.6"
          } ,
          "howler":{
            version:"^2.2.4"
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
      port: 5173,
      strictPort: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
})
