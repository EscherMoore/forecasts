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
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig