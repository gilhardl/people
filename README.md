# People

People is a lightweight contact manager that store and organize informations about your contacts, customers, providers, etc...

The key principle of People are :

* Lightweight & user-friendly
* Extensible & exportable

For now, it's not planned to manage customer relationships because People focuses on people arround your company and helping you collect informations about them. With a great contact database, you can integrate a lot of tools like :
* CRM / ERP ([Salesforce](https://www.salesforce.com), [Sage](https://www.sage.com), [Zoho](https://www.zoho.eu))
* Project management ([Asana](https://asana.com/), [Jira](https://www.atlassian.com/fr/software/jira))
* Emailing ([Mailchimp](https://mailchimp.com/), [Sendgrid](https://sendgrid.com/))
* etc...

> Visit [People's wiki](https://github.com/gilhardl/people/wiki/) for detailled specifications.

# How the project works

This project is managed using [Nx](https://nx.dev).

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.** ([Nx Documentation](https://nx.dev/angular))

## Adding capabilities to the workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are some plugins which you can add to the workspace:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@people/mylib`.

## Code scaffolding

Run `ng g [module|component|service|directive|etc...] my-component --project=my-app` to generate a new module, component, service, directive, etc...

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand the workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.
