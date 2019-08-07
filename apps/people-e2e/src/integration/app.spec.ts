import { getGreeting } from '../support/app.po';

describe('people', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to people!');
  });
});
