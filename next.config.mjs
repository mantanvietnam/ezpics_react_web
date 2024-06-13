/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_ROOT: "https://apis.ezpics.vn/apis",
  },
  images: {
    remotePatterns: [
      {
        hostname: "apis.ezpics.vn",
      },
    ],
    domains: ["img.vietqr.io"],
  },
};

export default nextConfig;
