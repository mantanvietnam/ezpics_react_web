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
      {
        protocol: "https",
        hostname: "img.vietqr.io", // Domain bổ sung
      },
    ],
  },
};

export default nextConfig;
