import UserSettingsPage from "../page-objects/user-settings-page";

describe("Check logout feature", { tags: "@user" }, () => {
  before(() => {
    cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
    UserSettingsPage.visit();
  });

  it("Should navigate to home page after logout", () => {
    UserSettingsPage.userPic().click();
    cy.getByTestId("logout").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    UserSettingsPage.userPic().should("not.exist");
  });
});
