module.exports = function (config) {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        crypto: false,
        stream: false,
      },
    },
    ignoreWarnings: [/Failed to parse source map/],
  };
};
