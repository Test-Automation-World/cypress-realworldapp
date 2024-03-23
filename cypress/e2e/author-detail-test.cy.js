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
  it("Expected author posts are displayed", () => {
    let articlesFront = [];
    AuthorDetailPage.getArticlesTitles().then((titles) => {
      articlesFront = titles;
    });
    cy.url().then((url) => {
      const authorName = url.match(/[^\/]+$/);
      ArticlesApi.getArticlesByAuthor(authorName.toString()).then(
        (articles) => {
          const titlesBack = articles.map((articles) => articles.title);
          expect(articlesFront).to.deep.members(titlesBack);
        }
      );
    });
  });
  it("Expected author favorited posts are displayed", () => {
    cy.intercept("GET", "**/articles?favorited=**", {
      fixture: "mockedArticles.json",
    }).as("favorited");
    AuthorDetailPage.showFavoritedPosts();
    cy.wait("@favorited");
    AuthorDetailPage.getArticlesTitles().should((titles) => {
      expect(titles, "Articles titles").to.have.lengthOf(4);
    });
  });
  it("Follow author", { tags: "@sanity" }, () => {
    FollowAuthorButton.getFollowAuthorButton().as("followButton").click();
    cy.get("@followButton").should("contain.text", "Unfollow");
    cy.get("@followButton").click();
    cy.get("@followButton").should("contain.text", "Follow");
  });
});
