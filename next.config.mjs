/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow all hostnames
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
