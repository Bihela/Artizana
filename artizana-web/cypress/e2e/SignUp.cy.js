describe('Sign Up Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('successfully signs up as Buyer and redirects to dashboard', () => {
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

    // WAIT FOR API REQUEST
    cy.wait('@register').its('request.body').should((body) => {
      expect(body).to.include({
        email: 'test@example.com',
        name: 'Test User',
        role: 'Buyer',
      });
    });

    // ASSERT REDIRECT
    cy.url().should('include', '/buyer-dashboard');

    // OPTIONAL: Check localStorage for token
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.eq('mock-jwt-token');
    });
  });
});
