/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
      },
    ],
  },
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_API_URL ||
      process.env.BACKEND_URL ||
      'http://127.0.0.1:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/+$/, '')}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
