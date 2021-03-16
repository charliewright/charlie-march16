## Quickstart Instructions

- You will need a node version > 12.0.0. I recommend using (NVM)[https://danyal.dk/blog/2018/11/11/install-nvm-node-version-manager-node-on-mac/] to manage your node version.
- `yarn && yarn start` to get a local build set up.

## Notes

Oh wow, I'm getting hundreds of websocket messages.

What is the throttle for react rendering?

I could buffer them somehow - only render once every ten!?

Do some sort of callback every second....

I could even implement it so that I can choose how frequently I want to re-render

I probably want to keep the result in memory right? rather than naively setting state every time I get a message from the websocket.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
