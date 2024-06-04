/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "apis.ezpics.vn",
      },
    ],
  },
};

export default nextConfig;
