# Pizza Tuesday Bot

Order a pizza from pizza tuesday and manage the orders using Telegram.

The project is built using [Node.js](https://nodejs.org), JavaScript, [Telegraf](https://telegrafjs.org/) and [Firebase](https://firebase.google.com/). It is set up for hosting on [Heroku](https://heroku.com) using [CI/CD](https://www.redhat.com/en/topics/devops/what-is-ci-cd).

---

## Set up

To run the project locally / in your own environt, you need to set up a few things first.

### Telegram

1. Follow the instructions on [creating a new bot using the BotFather](https://core.telegram.org/bots#6-botfather).
2. Store the api key safely
3. Rename `.example.env` to `.env`
4. Enter the previously saved token into the `TELEGRAM_TOKEN` variable

You could also create a second bot using the BotFather as a development bot. In this case, the production bot would run online (e.g. on [Heroku](https://heroku.com)) using the initial token. While you can develop and test new features using the development token.

### Firebase

1. Set up a **Firebase** project
2. Create a **Firestore** database
3. Go to **Settings** > **Service Accounts**
4. Generate a new **private key**
5. Copy the value of `project_id` in this file to `FIREBASE_PROJECT_ID` in `.env`
6. Copy the value of `client_email` in this file to `FIREBASE_CLIENT_EMAIL` in `.env`
7. Copy the value of `private_key` in this file to `FIREBASE_PRIVATE_KEY` in `.env`

### Remaining environment variables

1. Set `FIRESTORE_USER_COLLECTION` to the name of the collection in Firebase Firestore that will store all user entries. (e.g. `users`). To separate your development database from your production database, you could simply use a different collection name in your local environment variables, such as `dev-users`.
2. Do the same to all other environment variables following this schema: `FIRESTORE_<ENTITY>_COLLECTION`.

---

## Execution

The environment is set up to allow running in dev mode and in production mode. Before running the bot, make sure that you have followed **all** steps in the Set up section of this readme!

### Local

1. Make sure that you have installed Node.js at version **17.0.0 or higher**
2. Install all dependencies by running `npm i` at the root directory
3. Run `npm run dev`

This way you can do changes to your code and the bot will **automatically restart on save**. If you want to run it like in production, run `npm start` instead of the command in step 3.

### Hosted on Heroku for free

There are many different ways to host a Telegram bot like this, but I have chosen to host it as a worker on Heroku. This has the benefit of being **completely free** while also allowing **easy CI/CD integration**. I have followed [this guide](https://medium.com/geekculture/build-a-telegram-bot-using-typescript-node-js-and-telegraf-and-deploy-it-on-heroku-fcc28c15614f) in order to set everything up if you are interested in the **total process**.

In case you are only interested in setting up the Heroku app **using CI/CD**, [read more in this specific part of the article](https://medium.com/geekculture/build-a-telegram-bot-using-typescript-node-js-and-telegraf-and-deploy-it-on-heroku-fcc28c15614f#1ce8)
