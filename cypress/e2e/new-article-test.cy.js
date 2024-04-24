import NewArticlePage from "../page-objects/new-article-page";
import ArticleDetailPage from "../page-objects/article-detail-page";
import ArticlesApi from "../api-utils/article-api";
import Utils from "../utils/utils";

describe(
  "Check CRUD actions on articles",
  { tags: ["@sanity", "@articles"] },
  () => {
    let newArticle;
    before(() => {
      cy.setJwtTokenAsEnv(Cypress.env("email"), Cypress.env("password"));
    });
    beforeEach(() => {
      newArticle = Utils.generateNewArticleData();
      cy.loginWithSession(Cypress.env("email"), Cypress.env("password"));
      NewArticlePage.visit();
    });
    it("Should create a new article", function () {
      NewArticlePage.fillArticleForm(newArticle.article);
      NewArticlePage.publishArticle();
      //Yields article title from url and compares it to title in fixture after replacing spaces with dashes
      cy.url().should("include", newArticle.article.title.replace(/\s/g, "-"));
      ArticleDetailPage.getArticleBody().should(
        "have.text",
        newArticle.article.body
      );
      ArticleDetailPage.getArticleTags().should(
        "have.deep.members",
        newArticle.article.tagList
      );
    });
    it("Should update an existing article", () => {
      const editedData = {
        title: " edited title",
        description: "Edited description",
        body: "Edited body",
        tagList: [],
      };
      ArticlesApi.createNewArticle(newArticle).then((slug) => {
        cy.visit(`/article/${slug}`);
      });
      ArticleDetailPage.goToEditArticle();
      NewArticlePage.editArticle(editedData);

      cy.url().should("include", editedData.title.replace(/\s/g, "-"));
      ArticleDetailPage.getArticleBody().should(
        "contain.text",
        editedData.body
      );
    });
  }
);
