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
    return cy.getByTestId(ARTICLE_TITLE).map("textContent")
  }
  static showFavoritedPosts() {
    cy.contains('Favorited Articles').click()
  }
}
