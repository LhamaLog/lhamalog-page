import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts: [process.env.RAILWAY_PUBLIC_DOMAIN].filter(Boolean),
    watch: {
      usePolling: true,
    },
  },
});
