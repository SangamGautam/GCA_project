// Load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login to the application
       * @example cy.login('email@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
  