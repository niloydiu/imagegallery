/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Server actions configuration options go here
      allowedOrigins: ["localhost:3000", "localhost:3002"],
    },
  },
};

export default nextConfig;
