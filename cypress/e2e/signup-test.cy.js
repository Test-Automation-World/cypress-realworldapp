import SignUpPage from "../page-objects/signup-page";
import Utils from "../utils/utils";
import UserSettingsPage from "../page-objects/user-settings-page";

describe("Sign up feature", () => {
  beforeEach(() => {
    SignUpPage.visit();
  });

  it("Should register valid new user", () => {
    const newUser = Utils.generateNewUserData();
    cy.intercept("GET", "**/api/user").as("getUser");
    SignUpPage.fillForm(newUser);
    UserSettingsPage.userPic().parent().should("have.text", newUser.username);
    cy.wait("@getUser").then((user) => {
      expect(user.response.body.user.email, "User email").to.eq(newUser.email);
    });
  });

  it("Should display error message for email already in use", () => {
    cy.intercept("POST", "**/api/users").as("getUser");
    SignUpPage.fillForm({
      username: "testuser",
      email: Cypress.env("email"),
      password: "password",
    });
    cy.wait("@getUser").its("response.statusCode").should("eq", 422);
    SignUpPage.errorMessages().should(
      "have.text",
      "Email already exists.. try logging in"
    );
  });
});
