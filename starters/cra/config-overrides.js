const {ProvidePlugin} = require('webpack');

module.exports = function (config, env) {
    return {
        ...config,
        resolve: {
            ...config.resolve,
            fallback: {
                crypto: false,
                stream: false
            },
        },
        ignoreWarnings: [/Failed to parse source map/],
    };
};
