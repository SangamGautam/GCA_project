const path = require('path');
const { startDevServer } = require('@cypress/webpack-dev-server');

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startDevServer({
      options,
      webpackConfig: {
        resolve: {
          extensions: ['.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'ts-loader',
                  options: {
                    configFile: 'tsconfig.cypress.json',
                  },
                },
              ],
            },
          ],
        },
      },
    })
  );

  return config;
};
