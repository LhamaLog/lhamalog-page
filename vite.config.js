import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { planosDevPlugin } from "./vite.planos.js";

const allowedHosts = [
  process.env.RAILWAY_PUBLIC_DOMAIN,
  "lhamalog.com",
  "www.lhamalog.com",
].filter(Boolean);

export default defineConfig({
  plugins: [react(), tailwindcss(), planosDevPlugin()],
  define: {
    __LHAMALOG_AJUSTE_PLANOS__: JSON.stringify(process.env.LHAMALOG_AJUSTE_PLANOS === "1"),
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts,
  },
});
