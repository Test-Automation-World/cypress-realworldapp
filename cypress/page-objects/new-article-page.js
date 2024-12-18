import TagsPage from './tags-page'

// data-testid attributes
const TITLE = 'title'
const DESCRIPTION = 'description'
const BODY = 'body'
const TAGS = 'tags'
const SUBMIT_BUTTON = 'submit-button'


export default class NewArticlePage {
  static visit() {
    cy.visit('editor')
  }
  static fillArticleForm(newArticle) {
    cy.getByTestId(TITLE).type(newArticle.title)
    cy.getByTestId(DESCRIPTION).type(newArticle.description)
    cy.getByTestId(BODY).type(newArticle.body, { delay: 0 })
    Cypress._.each(newArticle.tagList, tag => cy.getByTestId(TAGS).type(tag + ' '))
  }
  static publishArticle() {
    cy.getByTestId(SUBMIT_BUTTON).click()
  }

  static editArticle(editedData) {
    cy.contains("Update Article").should('be.visible')
    this.fillArticleForm(editedData)
    this.publishArticle()
  }
}
