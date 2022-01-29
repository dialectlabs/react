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
  '@dialectlabs/react-ui',
]);

module.exports = withTM({
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
    return config;
  },
});

// module.exports = {
//   reactStrictMode: true,
// }
