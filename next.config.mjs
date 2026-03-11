import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot
  },
  images: {
    qualities: [75, 100]
  },
  async redirects() {
    return [
      {
        source: "/product-category/:slug",
        destination: "/products/:slug",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
