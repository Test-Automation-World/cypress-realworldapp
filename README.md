This project is a fork of [this one](https://github.com/TonyMckes/conduit-realworld-example-app), but customized to be used with test automation frameworks. That means that DOM elements have been added with the `data-testid` attribute, and the project can be run with docker-compose.

### Usage

To run the project, follow these steps:

1. Start the development server by executing the command:

   ```bash
   docker-compose up
   ```

2. Open a web browser and navigate to:
   - Home page should be available at [`http://localhost:3000/`](http://localhost:3000).
   - API endpoints should be available at [`http://localhost:3001/api`](http://localhost:3001/api).

#### Development Server

As described in the original project, you can run the development server like this:

1. Create a `.env` file in the `backend` directory with the same content as the `.env.example` file. You can customize the values if you want.
2. Install dependencies with `npm install`.
3. You need an instance of a database running. The easiest way is to use a docker container. Run the following command to start a PostgreSQL database:

   ```bash
   docker run --name realworldapp-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```

4. Create the database. You can run the following command from the root directory of the project:

   ```bash
   npm run sqlz -- db:create
   ```

5. Start the development server with `npm run dev`.
6. Open a web browser and navigate to [`http://localhost:3000/`](http://localhost:3000).
7. Optionally, you can populate the database with `npm run sqlz -- db:seed:all`.

### Cypress

This project utilizes Cypress for end-to-end testing of the web application. By integrating Cypress directly into the project, you benefit from seamless testing workflows and it's easier to run the tests when you need to change some code in the application

Once the app is running, you can run Cypress tests following these steps:

1. If you run the app via docker-compose, don't forget to install dependencies first: `npm install`
2. Run tests from the command line. In the root directory execute: `npm run cy:run`. This will execute all tests from the terminal
   1. A library was added to add support for tagging tests and filter them when running the tests from console. More info bellow
3. Run tests from Cypress runner interface. In the root directory execute: `npm run cy:open`. This will open a browser window, where you can choose which test to run
4. Inside .github/workflows directory you can find a workflow file to run tests in parallel on Github Actions runners

#### Additional libraries

- [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep#cypressgrep): Tag tests and filter them when running them from console: `npm run cy:run -- --env grepTags=@sanity`
- [@faker-js/faker](https://fakerjs.dev/guide/)
- [cypress-map](https://github.com/bahmutov/cypress-map)
- [cypress-mochawesome-reporter](https://www.npmjs.com/package/cypress-mochawesome-reporter)
- [cypress-split](https://github.com/bahmutov/cypress-split)
