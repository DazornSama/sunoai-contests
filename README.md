# SunoAI Contests

A simple application for SunoAI's contests management

## How to run

First of all install latest NodeJS version (https://nodejs.org/en/download/package-manager).

Then, after cloning this repo, open your favourite shell and follow these steps:

### Server

Create a `.env` file under the `server` folder with this content:

```env
PORT=5000
ENV="DEVELOPMENT"
MONGODB_URL="..."
MONGODB_DB="sunoai-contests"
```

You must fill the values knowning that:

- `PORT` refers to the port used by Express to run the APIs
- `ENV` refers to current environment mode (_DEVELOPMENT_ or _PRODUCTION_)
- `MONGODB_URL` refers to your MongoDB instance URL
- `MONGODB_DB` refers to the MongoDB database used

After, navigate (in your shell) to the `server` folder. After, run this command:

```shell
npm install
```

Then, you can launch the APIs just with this command:

```shell
npm start
```

**!!!: NodeJS built-in watch is enabled! Every time you save a file, the app will be rebuilt!**

### UI

Coming soon...
