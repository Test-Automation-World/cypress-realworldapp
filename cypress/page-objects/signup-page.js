export default class SignUpPage {
  static visit() {
    cy.visit("/register");
  }

  static fillForm({ username, email, password }) {
    cy.getByTestId("username").type(username);
    cy.getByTestId("email").type(email);
    cy.getByTestId("password").type(password + "{enter}");
  }

  static errorMessages() {
    return cy.getByTestId("signup-error");
  }
}
