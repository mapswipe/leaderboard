import firebase from 'firebase';
import { getLevelForContributionCount } from './Levels';

const logoSalesForce = require('../assets/companies/salesForce.png');
const logoMapSwipe = require('../assets/companies/mapSwipe.png');
const config = require('./config');

let localData = [];
try {
  // eslint-disable-next-line global-require
  localData = require('./msf-mapswipe-users-export.json').data;
  // eslint-disable-next-line no-console
} catch (e) { console.error(e); }

firebase.initializeApp(config);
const db = firebase.database();
const companies = ['apple', 'uber', 'slack', 'github', 'sf', 'twitter', 'amazon', 'google', 'ibm', 'sap'];

const matchesSearch = (str, pattern, isSearcAtStart) => isSearcAtStart
  ? str.toLowerCase().startsWith(pattern.toLowerCase())
  : str.toLowerCase().includes(pattern.toLowerCase());

const getCompanyLogo = (username) => {
  switch (username) {
    case (username.match(/^sf_/i) || {}).input: return logoSalesForce;
    default: return logoMapSwipe;
  }
};

const getFormattedData = (snapshot, query = undefined, isSearcAtStart) => {
  const data = [];
  let totalContributions = 0;
  let totalDistance = 0;

  snapshot.forEach((datum, index) => {
    let username = '';
    if (process.env.REACT_APP_SOURCE === 'dev') {
      username = `${companies[Math.floor(index % companies.length)]}_${datum.username}`;
    } else {
      datum = datum.val();
      username = datum.username.trim();
    }
    const { contributions, distance } = datum;
    const level = getLevelForContributionCount(distance);
    const logo = getCompanyLogo(username);
    if (!query || matchesSearch(username, query, isSearcAtStart)) {
      data.push({ contributions, distance, username, logo, level });
      totalContributions += contributions;
      totalDistance += distance;
    }
  });
  return { data, totalContributions, totalDistance };
};

const getDevData = (query = '', isSearcAtStart = true) => (
  new Promise((resolve, reject) => {
    const res = getFormattedData(localData, query, isSearcAtStart);
    if (res) resolve(res); else reject(Error('Something goes wrong'));
  })
);

const getProdData = (query = '', isSearcAtStart = true) => {
  const usersRef = db.ref('users');
  return usersRef.once('value')
    .then(snapshot => getFormattedData(snapshot, query, isSearcAtStart))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('Error getting documents', err);
      return null;
    });
};

/**
 * @return Promise of all Users data where User username match with query
 * @param query string
 */
export const getUsersPromise = (process.env.REACT_APP_SOURCE === 'dev') ? getDevData : getProdData;
