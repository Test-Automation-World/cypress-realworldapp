import GlobalFeedPage from "../page-objects/global-feed-page";
import FavoritesApi from "../api-utils/favorites-api";
import ArticleDetailPage from "../page-objects/article-detail-page";
import AuthorApi from "../api-utils/author-api";
import FollowAuthorButton from "../components/follow-author-button";
import { faker } from "@faker-js/faker";
import Comment from "../api-utils/comments-api";
import ArticlesApi from "../api-utils/article-api";
import Utils from "../utils/utils";

const articleIndex = 0;
describe("Checking article detail page", { tags: "@articles" }, () => {
  before(() => {
    cy.setJwtTokenAsEnv(Cypress.env("email"), Cypress.env("password"));
  });
  beforeEach(() => {
    cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
    ArticleDetailPage.visit();
  });

  context("Test fav feature", () => {
    before(() => {
      FavoritesApi.unfavoriteArticle();
    });

    it("Should like an article", { tags: "@sanity" }, () => {
      // Arrange
      cy.intercept("POST", "**/articles/*/favorite").as("postFavorite");
      GlobalFeedPage.getAmountOfLikes().then((amount) => {
        // Act
        cy.giveLikeToAnArticle();
        cy.wait("@postFavorite").its("response.statusCode").should("eq", 200);

        // Assert
        GlobalFeedPage.getAmountOfLikes().then((newAmount) => {
          expect(newAmount).to.eq(amount + 1);
        });
      });
    });
  });

  context("Test follow feature", () => {
    before(() => {
      AuthorApi.unfollowAuthor(articleIndex);
    });
    it("Should follow an author", function () {
      cy.wait(500);
      FollowAuthorButton.getFollowAuthorButton().as("followButton").click();
      cy.get("@followButton").should("contain.text", "Unfollow");
      cy.get("@followButton").click();
      cy.get("@followButton").should("contain.text", "Follow");
    });
  });

  context("Test add comment feature", () => {
    before(() => {
      Comment.deleteArticleComments(articleIndex);
    });
    it(
      "Should add a comment to an article",
      { tags: ["@sanity", "@comments"] },
      () => {
        // Arrange
        const message = faker.lorem.sentence();

        // Act
        ArticleDetailPage.sendComment(message);

        // Assert
        cy.contains(message).should("be.visible");

        ArticleDetailPage.getCommentCardByText(message).find("[data-testid='author-username']").should("have.text", Cypress.env("username"));
      }
    );
  });

  context("Test delete comment feature", () => {
    const message = faker.lorem.sentence();
    before(() => {
      Comment.addCommentToArticle(articleIndex, message);
    });
    it(
      "Should delete a comment from an article",
      { tags: ["@sanity", "@comments"] },
      () => {
        // Arrange
        cy.contains(message).should("be.visible");

        // Act
        ArticleDetailPage.deleteComment(message);

        // Assert
        cy.contains(message).should("not.exist");
      }
    );
  });

  context("Test delete article feature", () => {
    it("Should delete an article", { tags: "@sanity" }, () => {
      // Arrange
      let newArticle = Utils.generateNewArticleData(false);
      cy.wait(500);
      ArticlesApi.createNewArticle(newArticle).then((slug) => {
        cy.visit(`/article/${slug}`);
      });

      // Act
      ArticleDetailPage.deleteArticle();

      // Assert
      cy.url().should("equal", Cypress.config().baseUrl + "/");
      GlobalFeedPage.goToGlobalFeed();
      GlobalFeedPage.getArticlesTitles().then((titles) => {
        expect(titles).to.not.include(newArticle.article.title);
      });
    });
  });
});
