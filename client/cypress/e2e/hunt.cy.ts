import { HuntPage } from "cypress/support/hunt.po";

const page = new HuntPage();

describe('My Hunt Page', () => {
  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct page title on My Hunt Page', () => {
    page.getPageTitle().should('eq', 'My Hunts');
  });

  // it('Should click on card to navigate to detailed Hunt page, then go back to My Hunt page', () => {
  //   cy.get('.hunt-card', { timeout: 10000 }).first().click();
  //   cy.get('.hunt-title').first().should('have.length', 1);

  //   page.getSidenav()
  //   .should('be.hidden');
  //   page.getSidenavButton()
  //   .should('be.visible');

  //   page.getSidenavButton().click();
  //   page.getNavLink('Hunts').click();
  //   page.getSidenav().should('be.hidden');
  //   page.getPageTitle().should('eq', 'My Hunts');
  //   cy.url().should(url => expect(url.endsWith('/hunts')).to.be.true);
  // });

  // it('Should click on search button to navigate to detailed Hunt page, then go back to My Hunt page', () => {
  //   cy.get('.hunt-card', { timeout: 10000 }).first().find('[data-test=inspectHuntButton]').click();
  //   cy.get('.hunt-title').first().should('have.length', 1);

  //   page.getSidenav()
  //   .should('be.hidden');
  //   page.getSidenavButton()
  //   .should('be.visible');

  //   page.getSidenavButton().click();
  //   page.getNavLink('Hunts').click();
  //   page.getSidenav().should('be.hidden');
  //   page.getPageTitle().should('eq', 'My Hunts');
  //   cy.url().should(url => expect(url.endsWith('/hunts')).to.be.true);
  // });

  // Note*: These two commented test passed locally when we run e2e test on whoever lap or lab computer, but it just failed on GitHub not able to find hunt card.

  it('Should click add Hunt and navigate to the correct URL then go back to My Hunt page', () => {

    page.addHuntButton().click();

    cy.url().should(url => expect(url.endsWith('/hunts/new')).to.be.true);
    cy.get('.mat-mdc-card-title').should('have.text', 'Create HuntTasks');

    page.getSidenav()
      .should('be.hidden');
    page.getSidenavButton()
      .should('be.visible');

      page.getSidenavButton().click();
      page.getNavLink('Hunts').click();
      page.getSidenav()
      .should('be.hidden');
      cy.url().should(url => expect(url.endsWith('/hunts')).to.be.true);
  });
})
