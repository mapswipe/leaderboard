import firebase from 'firebase';
import { getLevelForContributionCount } from './Levels';

const config = require('./config');

let localData = [];
try {
  // eslint-disable-next-line global-require
  localData = require('./msf-mapswipe-users-export.json').data;
  // eslint-disable-next-line no-console
} catch (e) { console.error(e); }

firebase.initializeApp(config);
const db = firebase.database();
const companies = ['apple', 'uber', 'slack', 'github', 'lyft', 'twitter', 'amazon', 'google', 'ibm', 'sap'];

const isInclude = (str, pattern) => str.toLowerCase().includes(pattern.toLowerCase());

const getFormattedData = (snapshot, query = undefined) => {
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
    if (!query || isInclude(username, query)) {
      data.push({ contributions, distance, username, level });
      totalContributions += contributions;
      totalDistance += distance;
    }
  });
  return { data, totalContributions, totalDistance };
};

const getDevData = (query = '') => (
  new Promise((resolve, reject) => {
    const res = getFormattedData(localData, query);
    if (res) resolve(res); else reject(Error('Something goes wrong'));
  })
);

const getProdData = (query = '') => {
  const usersRef = db.ref('users');
  return usersRef.once('value')
    .then(snapshot => getFormattedData(snapshot, query))
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
