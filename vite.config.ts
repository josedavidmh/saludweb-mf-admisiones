import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Ver mf-agenda/vite.config.ts: evita "process is not defined" en el navegador.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: "src/mount.tsx",
      name: "SaludWebMFAdmisiones",
      formats: ["umd"],
      fileName: () => "mf-admisiones.umd.js",
    },
    outDir: "dist",
  },
});
