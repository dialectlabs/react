/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-bitpie',
  '@solana/wallet-adapter-coin98',
  '@solana/wallet-adapter-ledger',
  '@solana/wallet-adapter-mathwallet',
  '@solana/wallet-adapter-phantom',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-solflare',
  '@solana/wallet-adapter-sollet',
  '@solana/wallet-adapter-solong',
  '@solana/wallet-adapter-torus',
  '@solana/wallet-adapter-wallets',
  '@project-serum/sol-wallet-adapter',
  // FIXME: Uncomment these if you haven't built @dialectlabs/react and @dialectlabs/react-ui packages
  // and targeting the sources
  // '@dialectlabs/react-ui',
  // '@dialectlabs/react',
  // TODO: Ideally this should be @dialectlabs/web3 to reduce the amount of relative imports
  // Even more ideal case - this shouldn't be here at all, this repo should target a published version of @dialectlabs/web3
  // and changed to a `yarn link`ed version in testing/dev cases
  // '../../../protocol/',
]);

module.exports = withTM({
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*', // Proxy to Backend
      },
    ];
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      assert: false,
      process: false,
      util: false,
      path: false,
      os: false,
      crypto: false,
    };
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
});
