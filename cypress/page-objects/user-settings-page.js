const DEFAULT_PROFILE_IMAGE_URL =
  "https://api.realworld.io/images/smiley-cyrus.jpeg";

export const UserSettingsFields = {
  image: "profile-image",
  username: "username",
  bio: "bio",
  email: "email",
  password: "password",
};

export default class UserSettingsPage {
  static visit() {
    cy.visit("/settings");
  }

  static userPic() {
    return cy.getByTestId("user-pic");
  }

  static getField(fieldName) {
    return cy.getByTestId(fieldName);
  }

  static updateField(fieldName, fieldValue) {
    this.getField(fieldName).clear().type(fieldValue);
  }

  static updateAllFields(userSettings) {
    for (const field in userSettings) {
      if (userSettings[field]) {
        this.updateField(UserSettingsFields[field], userSettings[field]);
      }
    }
    this.submitForm();
  }

  static submitForm() {
    cy.get('button[type="submit"]').click();
  }

  static performLogout() {
    cy.getByTestId("logout").click();
  }
}
