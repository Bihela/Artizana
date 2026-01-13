// cypress/e2e/SignUp.cy.js
describe('Sign Up Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('successfully signs up as Buyer and goes through language popup', () => {
    // MOCK API RESPONSE
    cy.intercept('POST', '**/auth/register', {
      statusCode: 200,
      body: { token: 'mock-jwt-token' },
    }).as('register');

    // FILL FORM
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('input[placeholder="Confirm Password"]').type('password123');
    cy.get('input[placeholder="Full Name"]').type('Test User');
    cy.get('select').select('Buyer');
    cy.get('input#terms').check();

    // CLICK SUBMIT
    cy.contains('button', 'Sign Up').click();

    // LANGUAGE MODAL SHOULD APPEAR
    cy.contains('Choose your language').should('be.visible');

    // SELECT ENGLISH
    cy.contains('button', 'English').click();

    // WAIT FOR API REQUEST AFTER LANGUAGE SELECTION
    cy.wait('@register').its('request.body').should((body) => {
      expect(body).to.include({
        email: 'test@example.com',
        name: 'Test User',
        role: 'Buyer',
      });
    });

    // ASSERT REDIRECT TO /home
    cy.url().should('include', '/home');

    // OPTIONAL: Check localStorage for token
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.eq('mock-jwt-token');
    });

    // And language preference
    cy.window().then((win) => {
      const lang = win.localStorage.getItem('preferredLanguage');
      expect(lang).to.eq('en');
    });
  });
});
