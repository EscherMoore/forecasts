const nextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.googleusercontent.com',
          port: '',
          pathname: '/a/**',
        },
      ],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig