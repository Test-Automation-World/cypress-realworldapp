## Project description
The aim of this project is to showcase one way of creating an E2E test automation framework for [a web application](https://github.com/hugoguillin/realworld-app) using Cypress.

### Main features
- **Page Object Model**: design pattern to create a clear separation between the test code and the page code.
- **Use of Cypress inside the project**: Cypress is installed as a dev dependency in the project, so you can run the tests directly from the project. This makes it easier to run the tests when you need to change some code in the application, specially in a CI/CD pipeline.
- **Set up test data via API** to avoid flaky tests. See [example](cypress\e2e\user-details-test.cy.js#L47)
- **Mock request responses** to avoid heavy test setup and to be able to test different scenarios. See [example](\cypress\e2e\author-detail-test.cy.js#L35).
- **Reuse user authentication data between tests**. See [how to](cypress\support\commands.js#L36).
- **Run tests in parallel in CI**. See [workflow](./.github/workflows/cypress.yml).

## How to run the tests
### Prerequisites
- Node.js
- Docker
- Docker Compose

### Run target application
1. From the root directory of this project, run `docker-compose up -d` to start the target application on `http://localhost:3000`.
2. Seed the database with some data by running `docker-compose exec app npm run sqlz -- db:seed:all`.
3. Register a new user with the credentials listed in the [Cypress config file](cypress.config.js#L39) file. If you have `curl` installed, you can run the following command:
    ```bash
    curl -X POST 'http://localhost:3000/api/users' -H 'Content-Type: application/json' -d '{"user": {"username": "cypress-user","email": "cypress@realworld.com","password": "cypress@realworld.com"}}'
    ```

### Run tests
First, install the project dependencies by running `npm install` from the root directory of this project.

Then, you can run the tests in your local machine in different ways:
- From Cypress UI test runner: `npm run cy:open`
- From terminal: `npm run cy:run`

You can also run the tests in parallel in CI from the project's [Github Actions section](https://github.com/hugoguillin/cypress-realworldapp/actions/workflows/cypress.yml) or creating a pull request.

#### Additional libraries

- [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep#cypressgrep): Filter tests by tags: `npm run cy:run -- --env grepTags=@sanity`
- [@faker-js/faker](https://fakerjs.dev/guide/)
- [cypress-map](https://github.com/bahmutov/cypress-map)
- [cypress-mochawesome-reporter](https://www.npmjs.com/package/cypress-mochawesome-reporter)
- [cypress-split](https://github.com/bahmutov/cypress-split)
