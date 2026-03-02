/** @type {import('next').NextConfig} */
const nextConfig = {
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
