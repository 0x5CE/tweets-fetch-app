# Tweets Fetch App 

A full-stack app utilizing Twitter API to run a cron job to store tweets in Firebase and display them. The user can search the Tweets. Makes use of RamdaJS, Firebase & Twitter V2 API.

A video showing it in action: https://youtu.be/LFB3UoTWRJU

## Getting Started

The env.js files in server/ and src/ folders need to be configered with your Firebase and Twitter API credentials.

## Available Scripts

In the project directory, you can run:

### `npm start-frontend`

Starts the frontend.

### `npm start-server`

Starts the cronjob that runs every N seconds, fetches new Tweets, and stores them in Firebase.


