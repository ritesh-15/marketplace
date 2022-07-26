/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["gateway.pinata.cloud"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;