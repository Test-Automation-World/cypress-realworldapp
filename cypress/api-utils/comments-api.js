import Articles from "./article-api";
const url = Cypress.env('apiUrl')

export default class Comments {
static addCommentToArticle(articleIndex, comment) {
  let slug = ''
  Articles.getArticles()
    .then(articles => {
      slug = articles[articleIndex].slug
      cy.request({
        method: 'POST',
        url: `${url}/articles/${slug}/comments`,
        headers: {
          Authorization: 'Token ' + Cypress.env('token')
        },
        body: {
          comment: {
            body: comment
          }
        }
      })
    })
}

  static deleteArticleComments(articleIndex) {
    let slug = ''
    Articles.getArticles()
      .then(articles => {
        slug = articles[articleIndex].slug
        this.getArticlesComments(slug).then(articles => {
          articles.forEach(comment => {
            if (comment.author.username === Cypress.env('username')) {
              cy.request({
                method: 'DELETE',
                url: `${url}/articles/${slug}/comments/${comment.id}`,
                headers: {
                  Authorization: 'Token ' + Cypress.env('token')
                }
              })
            }
          })
        })
      })
  }

  static getArticlesComments(slug) {
    return cy.request({
      url: `${url}/articles/${slug}/comments`
    }).its('body.comments')
  }

}
