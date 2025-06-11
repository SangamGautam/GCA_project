const webpack = require('@cypress/webpack-preprocessor');

module.exports = (on) => {
  const options = {
    webpackOptions: {
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
  };

  on('file:preprocessor', webpack(options));
};
