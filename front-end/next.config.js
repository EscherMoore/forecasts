/** @type {import('next').NextConfig} */

module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/forecast",
        destination: "http://localhost:8000/forecast",
        has: [
          { type: 'query', key: 'location' },
        ],
      },
    ];
  };
  return {
    rewrites,
    reactStrictMode: true,
    swcMinify: true,
  };
};