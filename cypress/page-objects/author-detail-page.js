import ArticlesApi from '../api-utils/article-api'

const ARTICLE_TITLE = 'article-title'

export default class AuthorDetailPage {
  static visit() {
    ArticlesApi.getArticles().then(response => {
      const authorName = response[0].author.username
      const encodedAuthorName = encodeURIComponent(authorName)
      cy.visit('profile/' + encodedAuthorName)
    })
  }
  static getArticlesTitles() {
    return cy.getByTestId(ARTICLE_TITLE).then(article => {
      return article
        .map((_index, title) => {
          return title.textContent
        })
        .get() //This get transforms the JQuery object's array returned by map method into an array of strings
    })
  }
  static showFavoritedPosts() {
    cy.contains('Favorited Articles').click()
  }
}
