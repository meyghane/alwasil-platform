/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'alwasil-platform.vercel.app' }],
        destination: 'https://al-wasil.fr/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
