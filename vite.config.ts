import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    allowedHosts: [
      '8e56d123e8f5.ngrok-free.app',
      'd10780c11aa2.ngrok-free.app',
      '127c308ab56e.ngrok-free.app',
    ],
  },
})
