import firebase from 'firebase';

const config = require('./config');

let localData = [];
try {
  // eslint-disable-next-line global-require
  localData = require('./msf-mapswipe-users-export.json');
  // eslint-disable-next-line no-console
} catch (e) { console.error(e); }

// If eq 'dev' fetch data locally else (eq 'prod') fetch data from Firebase
const SOURCE = 'prod';

firebase.initializeApp(config);
const db = firebase.database();

const isInclude = (str, pattern) => str.toLowerCase().includes(pattern.toLowerCase());

export const getLocalData = (query = undefined) => {
  const companies = [
    'apple',
    'uber',
    'slack',
    'github',
    'lyft',
    'twitter',
    'amazon',
    'google',
    'ibm',
    'sap',
  ];
  const data = [];
  let totalContributions = 0;
  let totalDistance = 0;
  Object.keys(localData).forEach((key, index) => {
    const { contributions, distance, username } = localData[key];
    const company = companies[Math.floor(index % companies.length)];
    const formattedUsername = `${company}_${username}`;
    if (!query || isInclude(formattedUsername, query)) {
      data.push({
        contributions,
        distance,
        username: formattedUsername,
      });
      totalContributions += contributions;
      totalDistance += distance;
    }
  });
  return { data, totalContributions, totalDistance };
};

/**
 * @return Promise of all Users data where User username match with query
 * @param query string
 */
export const getUsersPromise = (query = '') => {
  // local data
  if (SOURCE === 'dev') {
    return new Promise((resolve, reject) => {
      const res = getLocalData(query);
      if (res) resolve(res); else reject(Error('Something goes wrong'));
    });
  }

  // prod data
  let totalContributions = 0;
  let totalDistance = 0;
  const usersRef = db.ref('users');
  return usersRef.once('value')
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        const docData = childSnapshot.val();
        const { contributions, distance, username } = docData;
        if (!query || isInclude(username, query)) {
          data.push(docData);
          totalContributions += contributions;
          totalDistance += distance;
        }
      });
      return { data, totalContributions, totalDistance };
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('Error getting documents', err);
      return null;
    });
};
