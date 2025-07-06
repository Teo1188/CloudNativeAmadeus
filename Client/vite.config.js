import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  define: {
  VITE_API_URL: JSON.stringify(process.env.VITE_API_URL || "https://cloud-native-amadeus.vercel.app"),
},
})
