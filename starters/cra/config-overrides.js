module.exports = function (config) {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        assert: false,
        buffer: false,
        crypto: false,
        stream: false,
      },
    },
    ignoreWarnings: [/Failed to parse source map/],
  };
};
