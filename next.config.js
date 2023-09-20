/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "assets.faceit-cdn.net",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "distribution.faceit-cdn.net",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.opendota.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
