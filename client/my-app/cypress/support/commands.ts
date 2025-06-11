// Custom Cypress commands can be added here
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login');
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password, { log: false });
    cy.get('button[type=submit]').click();
  });
  