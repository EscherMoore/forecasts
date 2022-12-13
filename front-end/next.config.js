const nextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.googleusercontent.com',
          pathname: '/a/**',
        },
      ],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig