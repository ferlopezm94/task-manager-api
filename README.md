# Task manager REST API

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Getting started

### Requirements

Make sure the following tools are installed in your system:

- [Node v12.X.X](https://nodejs.org/en/download/)
- [Yarn v1.21.X](https://yarnpkg.com/en/docs/install)
- [MongoDB v4.2.X](https://www.mongodb.com/try/download/community)

### Installation

Clone the GitHub repository and use `yarn` to install the dependencies:

```
$ git clone https://github.com/ferlopezm94/task-manager-api.git
$ cd task-manager-api
$ yarn install
```

## Development

### Local

Start your MongoDB server (`mongod`), add a `dev.env` file inside `config` folder (check `sample.env`) and run:

```
$ yarn dev
```

`ts-node-dev` will compile and start your program. You can start making some changes and each one will trigger a restart to your program.

### Build

To create a production build simply run:

```
$ yarn build
```

TypeScript will compile your program and create a production build in the `build` folder.

To run the production build locally run:

```
$ yarn start
```

## What's inside?

### Conventional commits

Commit messages are an essential part of software development because they allow us to communicate why our code changed. They're useful for your collaborators and also for your future self, so having a good convention from the beginning will facilitate development.

To enforce a good convention is followed we're using Commitizen and Commitlint.

Commitizen is a command line utility that will prompt you to fill in any required fields (run with `yarn commit`) and your commit messages will be formatted according to the standards defined by project maintainers. In our case, we're using the [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) standard with the following structure:

```
type(scope): subject
```

Commitlint is a linter for our commit messages and checks if they meet the [conventional commit format](https://www.conventionalcommits.org).

Commitizen and commitlint will enforce we're creating conventional commit messages and in conjunction with [husky](https://github.com/typicode/husky) they will prevent us from committing changes without the proper message structure.

### Semantic release

One of the advantages of using the conventional commit format is that dovetails with [SemVer](https://semver.org), by describing the features, fixes, and breaking changes made in commit messages.

Semantic release uses the commit messages to determine the type of changes in the codebase and automatically determines the next semantic version number, updates our version property in `package.json`, generates a changelog, commits the change and publishes the release to GitHub (both the commit and the release tag).

### ESLint and Prettier

Just as a good commit convention is important, so is it a good style guide to write consistent, reusable and clean code. That's what ESLint will be use for, to identify and report on patterns found in our codebase that don't follow a set of stablished rules.

In conjunction with [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky), we'll be able to run ESLint against staged git files in a pre-commit check (run after staging your changes and running `git commit` and before a commit is completed).

While ESLint analyzes our code for errors, it doesn't enforce a certain code formatting style. That's where Prettier comes into place, ensuring that all outputted code conforms to a consistent style.

Prettier and ESLint complement each other, but they can also conflict when they disagree about style rules. We've configured this project so that you can use both without conflict.

To enhance the developer experience we recommend you to install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) VSCode extensions. We also added a `settings.json` that will automatically apply your linting rules (as long as they are auto-fixable) every time you save your files.

### Jest

Testing our code is a fundamental part to ensure we're shipping code that works. Only through testing can you confidently deliver confident, professional code, change after change.

For that reason jest is an important part of our setup. It includes a wide variety of tools that allow us to create, run and structure tests.

Add new tests inside `__tests__` folders and run them using `yarn test`. To get test coverage information run `yarn test:coverage`.

To enhance the developer experience when reviewing jest snapshots we recommend you to install the [snapshot-tools](https://marketplace.visualstudio.com/items?itemName=asvetliakov.snapshot-tools) VSCode extension.

### GitHub templates and workflows

To ensure a standard when creating Pull Requests or Issues (bug or feature request) we've included some templates inside the `.github` folder.

To automate the release of new versions we're using GitHub Actions to run the following workflows:

- **Continuous integration:** Run on each pull request open to either `master` or `dev` branches. It will run eslint, the automated tests and build the project. If there's an error it will fail, ensuring a new change doesn't break the current codebase.
- **Verify pull request base branch:** Run when a pull request to the `master` branch is open. It will verify the base branch is `dev` and will fail if not the case.
- **Set release version:** Run when changes are pushed to `master`. It will run `semantic-release` and sync the `master` branch with `dev`. To enable this workflow in your repository add the `GH_TOKEN` based on a personal access token with repo scope.

To disable a given workflow simply remove the file.

## Contributions

Currently no contributions are been accepted.
