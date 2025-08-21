import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Only import the runtime error overlay in development to avoid prod issues
const isDev = process.env.NODE_ENV !== "production";
let runtimeErrorOverlay: any = undefined;
if (isDev) {
  // dynamic require to avoid ESM import resolution during build on prod
  runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default;
}

export default defineConfig({
  plugins: [
    react(),
    ...(isDev && runtimeErrorOverlay ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
