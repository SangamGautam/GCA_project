describe('ReportsMenuComponent', () => {
    beforeEach(() => {
      // Navigate to the component's URL
      cy.visit('/reports-menu');
    });
  
    it('should display the filters and reports section', () => {
      // Check if the filter sidebar is displayed
      cy.get('.filter-sidebar').should('exist').and('be.visible');
  
      // Check if the report content area is displayed
      cy.get('.report-content').should('exist').and('be.visible');
    });
  
    it('should show apply filter dialog if no filters are applied', () => {
      // Ensure all selects have the default option
      cy.get('select').each(select => {
        cy.wrap(select).find('option').first().should('be.disabled');
      });
  
      // Try to navigate to the frequency dashboard without applying filters
      cy.get('a.btn-icon').contains('Frequency').click();
      // Check if the alert is shown
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Please apply filters before navigating to the dashboard.');
      });
  
      // Try to navigate to the data analysis dashboard without applying filters
      cy.get('a.btn-icon').contains('Data Analysis').click();
      // Check if the alert is shown
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Please apply filters before navigating to the dashboard.');
      });
  
      // Try to navigate to the data exports dashboard without applying filters
      cy.get('a.btn-icon').contains('Data Exports').click();
      // Check if the alert is shown
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Please apply filters before navigating to the dashboard.');
      });
    });
  
    it('should apply filters and fetch reports', () => {
      // Mock the API response for fetching reports
      const mockReports = {
        students: [
          { id: 1, name: 'Report 1' },
          { id: 2, name: 'Report 2' }
        ]
      };
  
      cy.intercept('GET', 'http://localhost:3000/api/students*', { body: mockReports }).as('getReports');
  
      // Apply filters
      cy.get('select[name="studyLevel"]').select('All Study Level');
      cy.get('select[name="studentTypes"]').select('All Student Types');
      cy.get('select[name="studyAreas"]').select('All Study Area');
      cy.get('select[name="yearOfProgram"]').select('All Year of Program');
      cy.get('select[name="studyMode"]').select('All Study Mode');
      cy.get('select[name="campusType"]').select('All Campus Type');
      cy.get('button[type="submit"]').click();
  
      // Wait for the API call to complete and verify the response
      cy.wait('@getReports').then((interception) => {
        // Check the response data in the interception object
        const responseBody = interception.response.body;
        console.log('Fetched data:', responseBody); // Log the fetched data
  
        // Verify the response data
        expect(responseBody.students).to.have.length(2);
      });
    });
  
    it('should navigate to the dashboard if filters are applied and clicked on respective dashboards like frequency, data analysis, and data export', () => {
      // Mock the API response for fetching reports
      const mockReports = {
        students: [
          { id: 1, name: 'Report 1' },
          { id: 2, name: 'Report 2' }
        ]
      };
  
      cy.intercept('GET', 'http://localhost:3000/api/students*', { body: mockReports }).as('getReports');
  
      // Apply filters
      cy.get('select[name="studyLevel"]').select('All Study Level');
      cy.get('select[name="studentTypes"]').select('All Student Types');
      cy.get('select[name="studyAreas"]').select('All Study Area');
      cy.get('select[name="yearOfProgram"]').select('All Year of Program');
      cy.get('select[name="studyMode"]').select('All Study Mode');
      cy.get('select[name="campusType"]').select('All Campus Type');
      cy.get('button[type="submit"]').click();
  
      // Wait for the API call to complete and verify the response
      cy.wait('@getReports').then((interception) => {
        // Check the response data in the interception object
        const responseBody = interception.response.body;
        console.log('Fetched data:', responseBody); // Log the fetched data
  
        // Verify the response data
        expect(responseBody.students).to.have.length(2);
      });
  
      // Click the button to navigate to the frequency dashboard
      cy.get('a.btn-icon').contains('Frequency').click();
      cy.url().should('include', '/database-frequency-reports');
      cy.go('back');
  
      // Click the button to navigate to the data analysis dashboard
      cy.get('a.btn-icon').contains('Data Analysis').click();
      cy.url().should('include', '/data-analysis-reports');
      cy.go('back');
  
      // Click the button to navigate to the data exports dashboard
      cy.get('a.btn-icon').contains('Data Exports').click();
      cy.url().should('include', '/data-exports');
    });
  });
  