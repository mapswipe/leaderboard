# MapSwipe Leaderboard

A simple leaderboard to allow display and aggregation of user metrics for the [MapSwipe](www.mapswipe.org) app.

## Install and build

To get started, simply run

```
yarn install

yarn build
```

## Deploy

The app is deployed using Firebase. You can access the live version of the leaderboard at [leaderboard.mapswipe.org](leaderboard.mapswipe.org)
To deploy a new version, you will need to use the Firebase login and run:

```
firebase deploy --only hosting:leaderboard
```
