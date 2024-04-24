import AuthorDetailPage from "../page-objects/author-detail-page";
import ArticlesApi from "../api-utils/article-api";
import FollowAuthorButton from "../components/follow-author-button";

describe("Check author page", { tags: ["@articles", "@author"] }, () => {
  before(() => {
    cy.setJwtTokenAsEnv(Cypress.env("email"), Cypress.env("password"));
  });

  beforeEach(() => {
    cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
    AuthorDetailPage.visit();
  });

  it("Should display author articles", () => {
    // Arrange
    let articlesFront = [];
    AuthorDetailPage.getArticlesTitles().then((titles) => {
      articlesFront = titles;
    });

    // Act
    cy.url().then((url) => {
      const authorName = url.match(/[^\/]+$/); // Get the username from the URL
      ArticlesApi.getArticlesByAuthor(authorName.toString()).then(
        (articles) => {
          // Assert
          const titlesBack = articles.map((articles) => articles.title);
          expect(articlesFront).to.deep.members(titlesBack);
        }
      );
    });
  });

  it("Should display favorited articles", () => {
    // Arrange
    const articlesInMockedResponse = 4;
    cy.intercept("GET", "**/articles?favorited=**", {
      fixture: "mockedArticles.json",
    }).as("favorited");

    // Act
    AuthorDetailPage.showFavoritedPosts();
    cy.wait("@favorited");

    // Assert
    AuthorDetailPage.getArticlesTitles().should((titles) => {
      expect(titles, "Articles titles").to.have.lengthOf(
        articlesInMockedResponse
      );
    });
  });

  it("Should follow author", { tags: "@sanity" }, () => {
    FollowAuthorButton.getFollowAuthorButton().as("followButton").click();
    cy.get("@followButton").should("contain.text", "Unfollow");
    cy.get("@followButton").click();
    cy.get("@followButton").should("contain.text", "Follow");
  });
});
