import TagsApi from "../api-utils/tags-api";

// data-testid attributes
const TAG_PILL = "popular-tag";
const TAG_TAB = "tag-feed";
export default class TagsPage {
  static getTag() {
    return cy.getByTestId(TAG_PILL);
  }
  static getPopularTags() {
    return this.getTag()
      .map('textContent')
      .mapInvoke('trim');
  }

  static filterByTag(tagName = "") {
    cy.getByTestId(TAG_PILL).contains(tagName).click();
  }

  static getRandomTag() {
    return TagsApi.getPopularTags().then((tags) => {
      return tags[Cypress._.random(0, 10)];
    });
  }

  static getTagTab() {
    return cy.getByTestId(TAG_TAB);
  }
}
