
import { AddHuntPage } from '../support/add-hunt.po';

describe('Add hunt', () => {
  const page = new AddHuntPage();

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
  cy.get('[data-test=nameError]').should('exist').and('be.visible');
    page.getFormField('name').clear().type('This is a very long name that goes beyond the 50 character limit').blur();
    cy.get('[data-test=nameError]').should('exist').and('be.visible');
    // Entering a valid name should remove the error.
    page.getFormField('name').clear().type('John Smith').blur();
    cy.get('[data-test=nameError]').should('not.exist');

  //   // Before doing anything there shouldn't be an error
  //   cy.get('[data-test=ageError]').should('not.exist');
  //   // Just clicking the age field without entering anything should cause an error message
  //   page.getFormField('age').click().blur();
  //   // Some more tests for various invalid age inputs
  //   cy.get('[data-test=ageError]').should('exist').and('be.visible');
  //   page.getFormField('age').type('5').blur();
  //   cy.get('[data-test=ageError]').should('exist').and('be.visible');
  //   page.getFormField('age').clear().type('500').blur();
  //   cy.get('[data-test=ageError]').should('exist').and('be.visible');
  //   page.getFormField('age').clear().type('asd').blur();
  //   cy.get('[data-test=ageError]').should('exist').and('be.visible');
  //   // Entering a valid age should remove the error.
  //   page.getFormField('age').clear().type('25').blur();
  //   cy.get('[data-test=ageError]').should('not.exist');

  //   // Before doing anything there shouldn't be an error
  //   cy.get('[data-test=emailError]').should('not.exist');
  //   // Just clicking the email field without entering anything should cause an error message
  //   page.getFormField('email').click().blur();
  //   // Some more tests for various invalid email inputs
  //   cy.get('[data-test=emailError]').should('exist').and('be.visible');
  //   page.getFormField('email').type('asd').blur();
  //   cy.get('[data-test=emailError]').should('exist').and('be.visible');
  //   page.getFormField('email').clear().type('@example.com').blur();
  //   cy.get('[data-test=emailError]').should('exist').and('be.visible');
  //   // Entering a valid email should remove the error.
  //   page.getFormField('email').clear().type('user@example.com').blur();
  //   cy.get('[data-test=emailError]').should('not.exist');
  // });



});
})
