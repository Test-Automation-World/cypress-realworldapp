import TagsApi from "../api-utils/tags-api";
import TagsPage from "../page-objects/tags-page";
import ArticlesApi from "../api-utils/article-api";
import GlobalFeedPage from "../page-objects/global-feed-page";
import Utils from "../utils/utils";

describe("Checking the tags", { tags: "@tags" }, () => {
  before(() => {
    cy.setJwtTokenAsEnv(Cypress.env("email"), Cypress.env("password"));
  });
  beforeEach(() => {
    cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
    cy.visit("/");
  });

  context("Check popular tags", () => {
    before(() => {
      for (let i = 0; i < 10; i++) {
        let newArticle = Utils.generateNewArticleData();
        ArticlesApi.createNewArticle(newArticle);
      }
    });

    it("Check that all popular tags are displayed", () => {
      let front = [];
      TagsPage.getPopularTags().then((tags) => {
        front = tags.map((tag) => tag.toString().trim());
      });
      TagsApi.getPopularTags().should((tagsBack) => {
        expect(tagsBack).to.contain.members(front);
      });
    });

    it("Filter articles by tag", () => {
      cy.intercept("GET", "**/articles?tag=*").as("getArticlesByTag");
      TagsPage.getRandomTag().then((tagName) => {
        TagsPage.filterByTag(tagName);
        TagsPage.getTagTab().should("contain.text", tagName);
        cy.wait("@getArticlesByTag");
        GlobalFeedPage.getArticlesTitles().then((titles) => {
          ArticlesApi.getArticlesByTag(tagName).then((articles) => {
            expect(titles, "Articles titles front").to.deep.members(
              articles.map((article) => article.title)
            );
          });
        });
      });
    });
  });
});
