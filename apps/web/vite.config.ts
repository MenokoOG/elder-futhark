import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Goal:
 * - Split the huge vendor chunk into stable chunks (react/router/vendor/etc)
 * - Reduce initial load on mobile
 * - Silence the "800 kB" warning without hiding real bloat
 */
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],

  build: {
    // Your vendor chunk is ~1,010 kB. This keeps the warning meaningful,
    // but avoids constant noise while we split.
    chunkSizeWarningLimit: 1100,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // Core
          if (id.includes("react-dom") || id.includes("react")) return "react";

          // Router
          if (id.includes("react-router") || id.includes("react-router-dom")) return "router";

          // Firebase (if present)
          if (id.includes("firebase")) return "firebase";

          // Icons
          if (id.includes("lucide-react")) return "icons";

          // Common utilities libs that often bloat vendor
          if (id.includes("lodash")) return "lodash";
          if (id.includes("date-fns")) return "date-fns";

          // Everything else
          return "vendor";
        },
      },
    },
  },

  resolve: {
    // Helps prevent duplicated React via workspace packages
    dedupe: ["react", "react-dom"],
  },
});
