/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  // Keep the libSQL client external on the server bundle.
  serverExternalPackages: ['@libsql/client'],
  experimental: {},
};

module.exports = nextConfig;
