import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Landing page build. The Remotion video lives in src/remotion and is bundled
// separately by the Remotion CLI; Vite only follows imports from index.html.
// VITE_BASE lets the same build serve from a sub-path (GitHub project Pages: /<repo>/).
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
  publicDir: "public",
  build: { outDir: "dist", emptyOutDir: true },
});
