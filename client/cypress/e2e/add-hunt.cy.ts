
import { AddHuntPage } from '../support/add-hunt.po';

describe('Add hunt', () => {
  const page = new AddHuntPage();

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    cy.get('.mat-mdc-card-title').should('have.text', 'Create HuntTasks');
  });

  it('Should enable and disable the add hunt button', () => {

    page.addHuntButton().should('be.disabled');
    page.getFormField('title').type('test');
    page.addHuntButton().should('be.disabled');
    page.getFormField('description').type('testing description');
    page.getFormField('taskInput').type('task testing');
    page.addHuntButton().should('be.enabled');
  });

  it('Should show error messages for invalid inputs', () => {
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=nameError]').should('not.exist');
    // Just clicking the name field without entering anything should cause an error message
    page.getFormField('title').click().blur();
    cy.get('[data-test=nameError]').should('exist').and('be.visible');
    // Some more tests for various invalid name inputs
    page.getFormField('title').type('s').blur();
    page.getFormField('title').clear().type('This is a very long name that goes beyond the 50 character limit').blur();
    page.getFormField('description').type('s').blur();
    page.getFormField('description').clear().type('T'.repeat(150)).blur();
      // Add estimatedTime tests


    page.getFormField('taskInput').type('s').blur();
    page.getFormField('taskInput').clear().type('T'.repeat(150)).blur();

});
})
