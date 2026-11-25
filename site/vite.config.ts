import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

// The demo imports the kit's own sources from ../src — one copy of
// React and of @hyper-elements/react must serve both, so dedupe.
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "@hyper-elements/react"],
  },
  server: {
    fs: { allow: [resolve(here, "..")] },
  },
});
