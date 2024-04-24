export default class UserDetailsPage {
  static visit() {
    cy.visit(`/profile/${Cypress.env("username")}`);
  }

  static goToSettingsButton() {
    return cy.getByTestId("edit-profile-settings");
  }

  static myArticles() {
    return cy.contains("My Articles");
  }

  static favoritedArticles() {
    return cy.contains("Favorited Articles");
  }
}
