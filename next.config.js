/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "avatars.githubusercontent.com", "lh3.googleusercontent.com"],
  },
  experimental: {
    appDir: true,
  },
  // Remove the swcPlugins configuration
};

module.exports = nextConfig;