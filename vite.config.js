import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { planosDevPlugin } from "./vite.planos.js";
import { checkoutPlugin } from "./vite.checkout.js";

export default defineConfig({
  plugins: [react(), tailwindcss(), planosDevPlugin(), checkoutPlugin()],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts: [
      process.env.RAILWAY_PUBLIC_DOMAIN,
      "lhamalog.com",
      "www.lhamalog.com",
    ].filter(Boolean),
    watch: {
      usePolling: true,
    },
  },
});
