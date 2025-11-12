import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows external access via IP
    port: 5173,       // Optional: can change if needed
    proxy: {
      '/api': {
        target: 'https://plagiarism-checker-auth.duraseksa.gov.kh', // Replace with your backend API URL
        changeOrigin: true,
        secure: false
      }
    }
  }
});
