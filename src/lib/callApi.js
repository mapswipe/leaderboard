import firebase from 'firebase';

import { getLevelForContributionCount } from './Levels';
import { basicSort } from './sortFunctions';
import config from './config';
import { isV1, DISTANCE_TO_TACK } from '../constants';
import logoSalesForce from '../assets/companies/salesForce.png';
import logoMapSwipe from '../assets/companies/mapSwipe.png';

let localData = [];
try {
  /* eslint-disable global-require */
  if (isV1) {
    localData = require('./json/msf-mapswipe-users-export-v1.json').data;
  } else {
    localData = require('./json/msf-mapswipe-users-export.json');
  }
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

const getContributionsMetric = (contributions) => {
  let metric = 0;

  if (!contributions) {
    return 0;
  }

  Object.keys(contributions).forEach((key) => {
    metric += Object.keys(contributions[key]).length;
  });

  return metric;
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

    const { taskContributionCount = 0 } = datum;
    let { contributions, distance } = datum;
    contributions = isV1 ? contributions : getContributionsMetric(contributions);
    distance = isV1 ? distance : Math.floor(taskContributionCount * DISTANCE_TO_TACK);

    const level = getLevelForContributionCount(isV1 ? distance / DISTANCE_TO_TACK : taskContributionCount);
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
    const username = val.username ? val.username.trim() : '';
    val = { ...val, username };
    if (!invalidUsers.includes(username)) returnArr.push(val);
  });
  returnArr.sort((a, b) => basicSort(a, b, 'distance'));
  return returnArr;
};

const getProdData = (query = '', startsWithSearch = true) => {
  const dataRef = isV1 ? 'users' : 'v2/users';
  const usersRef = db.ref(dataRef);

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
