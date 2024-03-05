import { Hunt } from 'src/app/hunts/hunt';
import { AddHuntPage } from '../support/add-hunt.po';

describe('Add hunt', () => {
  const page = new AddHuntPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Hunt');
  });

  it('Should enable and disable the add hunt button', () => {
    // ADD USER button should be disabled until all the necessary fields
    // are filled. Once the last (`#emailField`) is filled, then the button should
    // become enabled.
    page.addHuntButton().should('be.disabled');
    page.getFormField('title').type('test');
    page.addHuntButton().should('be.disabled');
    page.getFormField('description').type('testing description');
    // page.addUserButton().should('be.disabled');
    // page.getFormField('email').type('invalid');
    // all the required fields have valid input, then it should be enabled
    page.addHuntButton().should('be.enabled');
  });

  // it('Should show error messages for invalid inputs', () => {
  //   // Before doing anything there shouldn't be an error
  //   cy.get('[data-test=nameError]').should('not.exist');
  //   // Just clicking the name field without entering anything should cause an error message
  //   page.getFormField('name').click().blur();
  //   cy.get('[data-test=nameError]').should('exist').and('be.visible');
  //   // Some more tests for various invalid name inputs
  //   page.getFormField('name').type('J').blur();
  //   cy.get('[data-test=nameError]').should('exist').and('be.visible');
  //   page.getFormField('name').clear().type('This is a very long name that goes beyond the 50 character limit').blur();
  //   cy.get('[data-test=nameError]').should('exist').and('be.visible');
  //   // Entering a valid name should remove the error.
  //   page.getFormField('name').clear().type('John Smith').blur();
  //   cy.get('[data-test=nameError]').should('not.exist');

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

  describe('Adding a new hunt', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });

    it('Should go to the right page, and have the right info', () => {
      const hunt: Hunt = {
        _id: null,
        hostid: 'kkid12345',
        title: 'This is a e2e test hunt title',
        description: 'This is some e2e hunt test description'
        };

      page.addHunt(hunt);

      // New URL should end in the 24 hex character Mongo ID of the newly added hunt
      cy.url()
        // .should('match', /\/hunt\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/hunts\/new$/);

      // The new hunt should have all the same attributes as we entered
      cy.get('.user-card-name').should('have.text', hunt.title);
      cy.get('.user-card-company').should('have.text', hunt.description);

      // We should see the confirmation message at the bottom of the screen
      page.getSnackBar().should('contain', `Added hunt ${hunt.title}`);
    });

    it('Should fail with no hunt description', () => {
      const hunt: Hunt = {
      _id: null,
      hostid: 'kkid1234',
      title: 'This is a e2e test hunt title',
      description: null
      };

      page.addHunt(hunt);

      // We should get an error message
      page.getSnackBar().should('contain', `Problem contacting the server – Error Code:`);

      // We should have stayed on the add new hunt page
      cy.url()
        .should('not.match', /\/hunts\/[0-9a-fA-F]{24}$/)
        .should('match', /\/hunts\/new$/);

      // The things we entered in the form should still be there
      page.getFormField('name').should('have.value', hunt.title);
    });
  });

});
