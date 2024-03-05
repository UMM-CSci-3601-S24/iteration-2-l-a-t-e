export class HuntPage {
  private readonly baseUrl = '/hunts';
  private readonly pageTitle = '.hunt-title';
  private readonly huntCardSelector = '.hunt-cards-container app-hunt-card';
  private readonly addHuntButtonSelector = '[data-test=addHuntButton]';
  private readonly sideNavButton = '.sidenav-button';
  private readonly sideNav = '.sidenav';
  private readonly sideNavOption = '[routerlink] > .mdc-list-item__content';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getUrl() {
    return cy.url();
  }

  /**
   * Gets the title of the app when visiting the `/todos` page.
   *
   * @returns the value of the element with the ID `.todo-list-title`
   */
  getPageTitle() {
    return cy.title();
  }


  addHuntButton() {
    return cy.get(this.addHuntButtonSelector);
  }

  getSidenavButton() {
    return cy.get(this.sideNavButton);
  }

  getSidenav() {
    return cy.get(this.sideNav);
  }

  getNavLink(navOption: string) {
    return cy.contains(this.sideNavOption, `${navOption}`);
  }

  /**
   * Get all the `app-hunt-card` DOM elements.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `app-hunt-card` DOM elements.
   */
  getHuntCards() {
    return cy.get(this.huntCardSelector);
  }
}
