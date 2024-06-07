/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_ROOT: "https://apis.ezpics.vn/apis"
  },
  images: {
    remotePatterns: [
      {
        hostname: "apis.ezpics.vn",
      },
    ],
  },
};

export default nextConfig;
