import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Pin the workspace root to this project. Without it, Next.js sees the
// lockfile in the parent home directory and infers the wrong root.
const nextConfig: NextConfig = {
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default nextConfig;
