import { HuntPage } from "cypress/support/hunt.po";

const page = new HuntPage();

describe('Todo List', () => {
  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct page title on My Hunt Page', () => {
    page.getPageTitle().should('eq', 'My Hunts');
  });

  // it('Should click on card or search button to navigate to detailed Hunt page, then go back to My Hunt page', () => {
  //   page.getHuntCards().first().find('card').click();
  //   cy.get('.hunt-card-title').first().should('have.text');

    // page.getSidenav()
    // .should('be.hidden');
    // page.getSidenavButton()
    // .should('be.visible');

    // page.getSidenavButton().click();
    // page.getNavLink('Hunts').click();
    // page.getSidenav().should('be.hidden');
    // page.getPageTitle().should('eq', 'My Hunts');
    // cy.url().should(url => expect(url.endsWith('/hunts')).to.be.true);
  // });
  // I don't have MongoDB setup for now so this test is still in progress.

  it('Should click add Hunt and navigate to the correct URL then go back to My Hunt page', () => {

    page.addHuntButton().click();

    cy.url().should(url => expect(url.endsWith('/hunts/new')).to.be.true);

    page.getSidenav()
      .should('be.hidden');
    page.getSidenavButton()
      .should('be.visible');

      page.getSidenavButton().click();
      page.getNavLink('Hunts').click();
      page.getSidenav()
      .should('be.hidden');
  });
})
