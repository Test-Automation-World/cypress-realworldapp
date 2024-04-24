import UserSettingsPage, {
  UserSettingsFields,
} from "../page-objects/user-settings-page";
import Utils from "../utils/utils";
import CommonApi from "../api-utils/common-api";
import UserApi from "../api-utils/user-api";

describe("user-settings-test", { tags: "@user" }, () => {
  let fieldsToUpdate;
  let newUserData;

  before(() => {
    cy.setJwtTokenAsEnv(Cypress.env("email"), Cypress.env("password"));
  });

  beforeEach(() => {
    newUserData = Utils.generateNewUserData();
    CommonApi.registerNewUser(newUserData)
      .as("newUser")
      .then((newUser) => {
        cy.loginWithSession(newUser.email, newUserData.password);
      });
    fieldsToUpdate = Utils.generateUserSettingsData();
    UserSettingsPage.visit();
  });

  it("Should update user profile picture", () => {
    //Arrange
    cy.contains("Your Settings").should("be.visible");

    //Act
    UserSettingsPage.updateField(
      UserSettingsFields.image,
      fieldsToUpdate.user.image
    );
    UserSettingsPage.submitForm();

    //Assert
    UserSettingsPage.userPic()
      .invoke("attr", "src")
      .should("eq", fieldsToUpdate.user.image);
  });

  it("Should update username", () => {
    //Arrange
    cy.intercept("PUT", "/api/user").as("updateUser");

    //Act
    UserSettingsPage.updateField(
      UserSettingsFields.username,
      fieldsToUpdate.user.username
    );
    UserSettingsPage.submitForm();
    cy.wait("@updateUser").then((user) => {
      //Assert
      expect(user.response.body.user.username, "User username").to.eq(
        fieldsToUpdate.user.username
      );
    });
    UserSettingsPage.userPic()
      .parent()
      .should("have.text", fieldsToUpdate.user.username);
  });

  it("Should update user bio", () => {
    //Arrange
    cy.intercept("PUT", "/api/user").as("updateUser");

    //Act
    UserSettingsPage.updateField(
      UserSettingsFields.bio,
      fieldsToUpdate.user.bio
    );
    UserSettingsPage.submitForm();
    cy.wait("@updateUser").then((user) => {
      //Assert
      expect(user.response.body.user.bio, "User bio").to.eq(
        fieldsToUpdate.user.bio
      );
    });
    UserSettingsPage.getField(UserSettingsFields.bio).should(
      "have.value",
      fieldsToUpdate.user.bio
    );
  });

  it("Should update user email", { tags: "@sanity" }, () => {
    //Arrange
    const userNewEmail = fieldsToUpdate.user.email;
    const userPassword = newUserData.password;
    cy.intercept("PUT", "/api/user").as("updateUser");

    //Act
    UserSettingsPage.updateField(UserSettingsFields.email, userNewEmail);
    UserSettingsPage.submitForm();
    cy.wait("@updateUser");

    //Assert
    UserApi.getUser(userNewEmail, userPassword).then((user) => {
      expect(user.email, "User email").to.eq(fieldsToUpdate.user.email);
    });
    UserSettingsPage.getField(UserSettingsFields.email).should(
      "have.value",
      userNewEmail
    );
  });

  it("Should update user password", { tags: "@sanity" }, () => {
    //Arrange
    const userEmail = newUserData.email;
    const newPassword = fieldsToUpdate.user.password;
    cy.intercept("PUT", "/api/user").as("updateUser");

    //Act
    UserSettingsPage.updateField(UserSettingsFields.password, newPassword);
    UserSettingsPage.submitForm();
    cy.wait("@updateUser");

    //Assert
    //Login again with new password
    UserApi.getUser(userEmail, newPassword).then((user) => {
      expect(user.email, "User email").to.eq(userEmail);
    });
    // If this assertion works ok in a real application, it would be a security risk
    UserSettingsPage.getField(UserSettingsFields.password)
      .invoke("val")
      .should("eq", newPassword);
  });

  it("Should update all fields at once", () => {
    //Arrange
    const newUserData = fieldsToUpdate.user;
    cy.intercept("PUT", "/api/user").as("updateUser");

    //Act
    UserSettingsPage.updateAllFields(fieldsToUpdate.user);
    cy.wait("@updateUser");

    //Assert
    UserSettingsPage.userPic()
      .invoke("attr", "src")
      .should("eq", newUserData.image);
    UserSettingsPage.userPic()
      .parent()
      .should("have.text", newUserData.username);
    UserSettingsPage.getField(UserSettingsFields.bio).should(
      "have.value",
      newUserData.bio
    );
    UserSettingsPage.getField(UserSettingsFields.email).should(
      "have.value",
      newUserData.email
    );
    UserSettingsPage.getField(UserSettingsFields.password)
      .invoke("val")
      .should("eq", newUserData.password);
  });
});
