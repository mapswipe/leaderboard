# MapSwipe Leaderboard
https://leaderboard.mapswipe.org

A simple leaderboard to allow display and aggregation of user metrics for the [MapSwipe](www.mapswipe.org) app.

## Install and build

To get started, simply run

```
yarn install

yarn build
```

## Development
To run on local, run
```
yarn start
```

This will run the app with local data (not API call) located in `lib/json`. This folder is ignored in the repo. You can create your own by downloading from Firebase console (Database Tab) those records:
- `users` as `src/lib/json/msf-mapswipe-users-export-v1.json`
- `v2/users` as `src/lib/json/msf-mapswipe-users-export.json`

To run on local with real data, simply run
```
yarn start:prod
```
As Firebase API have a limited number of API call, it would better to use real data just as final tests before deployment. 

## Deploy

The app is deployed using Firebase. You can access the live version of the leaderboard at [leaderboard.mapswipe.org](leaderboard.mapswipe.org)
To deploy a new version, you will need to use the Firebase login and run:

### On staging
```
yarn deploy:staging
```

### On prod
```
yarn deploy:prod
```
