/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    typedRoutes: true,
    externalDir: true
  }
};

export default nextConfig;
