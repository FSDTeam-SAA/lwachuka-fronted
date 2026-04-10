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

    formats: ["image/avif", "image/webp"], // better quality + smaller size

    minimumCacheTTL: 60, // cache optimization
  },
};

export default nextConfig;