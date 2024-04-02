import repoConfig from '../../prettier.config.mjs';
/** @type {import("prettier").Config} */
const config = {
  ...repoConfig,
  tailwindConfig: "./tailwind.config.js"
};

export default config;
