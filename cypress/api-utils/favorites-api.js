import ArticlesApi from "../api-utils/article-api";
const url = Cypress.env("apiUrl");

export default class FavoritesApi {
  static getUserFavorites(username) {
    return cy
      .request(`${url}/articles?favorited=${username}&&limit=10`)
      .then((response) => {
        return response.body.articles;
      });
  }

  /**
   * Check if the selected article was already favorited by the user
   * If so, removes that favorite from the article
   * @param index Index of the article selected for the test
   */
  static unfavoriteArticle(index = 0) {
    let slug = "";
    let finalSlug;
    ArticlesApi.getArticles()
      .then((articles) => {
        slug = articles[index].slug;
      })
      .then(() => {
        this.getUserFavorites(Cypress.env("username")).then((article) => {
          article.forEach((a) => {
            if (a.slug === slug) {
              finalSlug = slug;
            }
          });
        });
      })
      .then(() => {
        if (finalSlug !== undefined) {
          cy.request({
            method: "DELETE",
            url: `${url}/articles/${slug}/favorite`,
            headers: {
              Authorization: "Token " + Cypress.env("token"),
            },
          });
        }
      });
  }

  static favoriteArticle(slug) {
    cy.request({
      method: "POST",
      url: `${url}/articles/${slug}/favorite`,
      headers: {
        Authorization: "Token " + Cypress.env("token"),
      },
    });
  }
}
