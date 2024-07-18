/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_ROOT: "https://apis.ezpics.vn/apis",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apis.ezpics.vn",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    domains: ["img.vietqr.io"],
  },
};

export default nextConfig;
