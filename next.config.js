/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'media.sproutsocial.com',
    ],
  },
};

module.exports = nextConfig;
