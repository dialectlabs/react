# Dialect

React components to use Dialect's web3 notifications.

## Installation

**npm:**
```shell
npm install @dialectlabs/react @dialectlabs/react-ui --save
```

**yarn:**
```shell
yarn add @dialectlabs/react @dialectlabs/react-ui
```

## Development

### Prerequisites
- Git
- Yarn (<2)
- Nodejs (>=15.10 <17)

### Get Started
This repo utilizes [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). Publishable packages are located under `packages` directory. `examples` directory contains projects to demonstrate how can Dialect be used. 

For development, you implement necessary component inside the packages and use them in examples to visualize them.

To get started, launch example's next dev server:
```shell
yarn # in root dir
cd examples/basic
yarn dev
```

Now you have a hot reload of the packages in the workspace.

## Publishing

TBD

## Know-hows
- Currently every npm project inside the `packages` and `examples` directories, becomes part of the workspaces. Referencing other workspace package can be done by using npm project's name (in `package.json`)
  - Root `package.json` MAY contain references to child npm projects to simplify ci commands: e.g. in root `package.json` - `yarn build:react-ui` which would call the `packages/dialect-react-ui`'s `build` command.
- Linting configuration in located in repo's root and takes over the code style for all projects.