/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "quixotic-impala-265.convex.cloud",
        port: "",
      },
      {
        protocol: "https",
        hostname: "kindred-rhinoceros-563.convex.cloud",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
