import firebase from 'firebase';
import { getLevelForContributionCount } from './Levels';
import { basicSort } from './sortFunctions';
import config from './config';

const logoSalesForce = require('../assets/companies/salesForce.png');
const logoMapSwipe = require('../assets/companies/mapSwipe.png');

let localData = [];
try {
  // eslint-disable-next-line global-require
  localData = require('./msf-mapswipe-users-export.json').data;
  // eslint-disable-next-line no-console
} catch (e) { console.error(e); }

firebase.initializeApp(config);
const db = firebase.database();
const companies = ['apple', 'uber', 'slack', 'github', 'sf', 'twitter', 'amazon', 'google', 'ibm', 'sap'];

const matchesSearch = (str, pattern, startsWithSearch) => startsWithSearch
  ? str.toLowerCase().startsWith(pattern.toLowerCase())
  : str.toLowerCase().includes(pattern.toLowerCase());

const getCompanyLogo = (username) => {
  switch (username) {
    case (username.match(/^sf_/i) || {}).input: return logoSalesForce;
    default: return logoMapSwipe;
  }
};

const getFormattedData = (snapshot, query = undefined, startsWithSearch) => {
  const data = [];
  let totalContributions = 0;
  let totalDistance = 0;
  const overallDataLength = snapshot.length;
  snapshot.forEach((datum, index) => {
    let { username } = datum;
    if (process.env.REACT_APP_SOURCE === 'dev') {
      username = `${companies[Math.floor(index % companies.length)]}_${datum.username.trim()}`;
    }
    const { contributions, distance } = datum;
    const level = getLevelForContributionCount(distance);
    const logo = getCompanyLogo(username);
    if (!query || matchesSearch(username, query, startsWithSearch)) {
      data.push({ contributions, distance, username, logo, level, rank: index + 1 });
      totalContributions += contributions;
      totalDistance += distance;
    }
  });
  return { data, totalContributions, totalDistance, overallDataLength };
};

const getDevData = (query = '', startsWithSearch = true) => (
  new Promise((resolve, reject) => {
    const res = getFormattedData(localData.sort((a, b) => basicSort(a, b, 'distance')), query, startsWithSearch);
    if (res) resolve(res); else reject(Error('Something goes wrong'));
  })
);

const snapshotToArray = (snapshot) => {
  const invalidUsers = ['Aeroiio4', 'HhhS', 'Pimdw', 'Hshshs', 'HhaaAh', 'Fcccf'];
  const returnArr = [];
  snapshot.forEach((childSnapshot) => {
    let val = childSnapshot.val();
    const username = val.username.trim();
    val = { ...val, username };
    if (!invalidUsers.includes(username)) returnArr.push(val);
  });
  returnArr.sort((a, b) => basicSort(a, b, 'distance'));
  return returnArr;
};

const getProdData = (query = '', startsWithSearch = true) => {
  const usersRef = db.ref('users');
  return usersRef.once('value')
    .then(snapshot => getFormattedData(snapshotToArray(snapshot), query, startsWithSearch))
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
