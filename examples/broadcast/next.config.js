module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  // TODO: pass dialect env as env variable and enable proxy only on local-development
  rewrites:
    process.env.NODE_ENV == 'development'
      ? async () => {
          return [
            {
              source: '/:path*',
              destination: 'http://localhost:8080/:path*',
            },
          ];
        }
      : undefined,
};
