
describe('LoginComponent', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('should display the login form', () => {
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  
    it('should navigate to /reports-menu on correct credentials', () => {
      cy.get('input[name="username"]').type('admin');
      cy.get('input[name="password"]').type('admin');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/reports-menu');
    });
  
    it('should alert on incorrect credentials', () => {
      cy.get('input[name="username"]').type('wrong');
      cy.get('input[name="password"]').type('wrong');
      cy.get('button[type="submit"]').click();
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Incorrect username or password');
      });
    });
  });
  