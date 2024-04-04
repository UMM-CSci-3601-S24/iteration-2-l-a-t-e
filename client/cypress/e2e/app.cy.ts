import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => page.navigateTo());

  it('Should have the correct title', () => {
    page.getAppTitle().should('contain', 'Scav-a-Snap - By Team L.A.T.E.');
  });

  it('The sidenav should open, navigate to "Hunts" and back to "Home"', () => {
    // Before clicking on the button, the sidenav should be hidden
    page.getSidenav()
      .should('be.hidden');
    page.getSidenavButton()
      .should('be.visible');

    page.getSidenavButton().click();
    page.getNavLink('Hunts').click();
    cy.url().should('match', /\/hunts$/);
    page.getSidenav()
      .should('be.hidden');

    // Try to navigate to Home
    page.getSidenavButton().click();
    page.getNavLink('Home').click();
    cy.url().should('match', /^https?:\/\/[^/]+\/?$/);
    page.getSidenav()
      .should('be.hidden');
  });

});
