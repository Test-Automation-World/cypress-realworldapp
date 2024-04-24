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
  it("Should display expected articles", () => {
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

describe("Fav feature", { tags: "@articles" }, () => {
  beforeEach(() => {
    cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
    FavoritesApi.unfavoriteArticle(0);
    GlobalFeed.visit();
  });
  it("Should like an article", () => {
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
