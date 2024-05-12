import Utils from "../utils/utils";
import ArticlesApi from "../api-utils/article-api";
import FavoritesApi from "../api-utils/favorites-api";
import UserDetailsPage from "../page-objects/user-details-page";
import GlobalFeedPage from "../page-objects/global-feed-page";

describe("Check user detail page", { tags: "@user" }, () => {
  before(() => {
    cy.setJwtTokenAsEnv(Cypress.env("email"), Cypress.env("password"));
  });
  beforeEach(() => {
    cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
    UserDetailsPage.visit();
  });

  it("Should navigate to settings page", () => {
    UserDetailsPage.goToSettingsButton().should(
      "have.attr",
      "href",
      "#/settings"
    );
  });

  context("Check user articles", () => {
    before(() => {
      // Let's make sure user has at least 5 articles
      for (let i = 0; i < 5; i++) {
        let newArticle = Utils.generateNewArticleData();
        ArticlesApi.createNewArticle(newArticle);
      }
    });
    it("Should display expected user articles", () => {
      UserDetailsPage.myArticles().should("have.class", "active");
      ArticlesApi.getArticlesByAuthor(Cypress.env("username")).as(
        "articlesBack"
      );
      GlobalFeedPage.getArticlesTitles().then((titles) => {
        cy.get("@articlesBack").then((articles) => {
          expect(titles).to.deep.members(
            articles.map((article) => article.title)
          );
        });
      });
    });
  });

  context("Check user favorited articles", () => {
    let randomArticles
    before(() => {
      // In order for the test to be deterministic, first we need to unfavorite all articles
      FavoritesApi.getUserFavorites(Cypress.env("username")).then(
        (articles) => {
          articles.forEach((article) => {
            cy.request({
              method: "DELETE",
              url: `${Cypress.env("apiUrl")}/articles/${article.slug}/favorite`,
              headers: {
                Authorization: "Token " + Cypress.env("token"),
              },
            });
          });
        }
      );

      // Then, let's favorite 5 articles
      ArticlesApi.getArticles().then((articles) => {
        randomArticles = Cypress._.sampleSize(articles, 5);
        randomArticles.forEach((article) => {
          FavoritesApi.favoriteArticle(article.slug);
        });
      });
    });

    it("Should display user favorited articles", () => {
      UserDetailsPage.favoritedArticles().click();

      GlobalFeedPage.getArticlesTitles().then((titles) => {
          expect(titles).to.deep.members(
            randomArticles.map((article) => article.title)
          );
      });
    });
  });
});
