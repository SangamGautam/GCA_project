import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      return require('./cypress/plugins/index.js')(on, config);
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.ts',
    baseUrl: 'http://localhost:4200', // Ensure this matches your Angular app's URL
  },
  component: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      return require('./cypress/plugins/index.js')(on, config);
    },
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
  },
});
