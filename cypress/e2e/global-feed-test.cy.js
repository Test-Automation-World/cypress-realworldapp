import GlobalFeed from "../page-objects/global-feed-page";
import Articles from "../api-utils/article-api";
import FavoritesApi from "../api-utils/favorites-api";

describe("Testing global feed", { tags: "@articles" }, () => {
  before(() => {
    cy.setJwtTokenAsEnv(Cypress.env("email"), Cypress.env("password"));
  });
  beforeEach(() => {
    cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
    GlobalFeed.visit();
  });
  it("Check if all expected articles are displayed", () => {
    GlobalFeed.goToGlobalFeed();
    Articles.getArticles().then((response) => {
      const titlesBack = response.map((article) => article.title);
      GlobalFeed.getArticlesTitles().then((titles) => {
        titles.forEach((value) => {
          expect(titlesBack).to.include(value);
        });
      });
    });
  });
});

describe("Like articles", { tags: "@articles" }, () => {
  beforeEach(() => {
    cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
    FavoritesApi.unfavoriteArticle(0);
    GlobalFeed.visit();
  });
  it("Give like to an article", () => {
    GlobalFeed.goToGlobalFeed();
    cy.intercept("POST", "**/articles/**/favorite").as("postFavorite");
    GlobalFeed.getAmountOfLikes().then((amount) => {
      cy.giveLikeToAnArticle();
      cy.wait("@postFavorite");
      GlobalFeed.getAmountOfLikes().then((newAmount) => {
        expect(newAmount).to.eq(amount + 1);
      });
    });
  });
});
