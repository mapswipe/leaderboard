require('firebase/firestore');
const firebase = require('firebase');
const config = require('./config');
const localData = require('./msf-mapswipe-users-export.json');

firebase.initializeApp(config);
const db = firebase.firestore();

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
  Object.keys(localData).forEach((key) => {
    const { contributions, distance, username } = localData[key];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const formattedUsername = `${company}_${username}`;
    if (!query || formattedUsername.toLowerCase().includes(query.toLowerCase())) {
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
 * @return Promise of all Users data
 * @param state string. If eq 'dev' fetch data localy else eq 'prod' fetch data from Firebase
 */
export const getUsersPromise = (state = 'prod') => {
  // local data
  if (state === 'dev') {
    return new Promise((resolve, reject) => {
      const res = getLocalData();
      if (res) resolve(res); else reject(Error('Something goes wrong'));
    });
  }

  // prod data
  let totalContributions = 0;
  let totalDistance = 0;
  const usersRef = db.collection('users');
  return usersRef.get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        const { contributions, distance } = docData;
        data.push(docData);
        totalContributions += contributions;
        totalDistance += distance;
      });
      return { data, totalContributions, totalDistance };
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('Error getting documents', err);
      return null;
    });
};

/**
 * @return Promise of all Users data where User username match with query
 * @param query string
 * @param state string. If eq 'dev' fetch data localy else eq 'prod' fetch data from Firebase
 */
export const getUsersByQueryPromise = (query, state = 'prod') => {
  // local data
  if (state === 'dev') {
    return new Promise((resolve, reject) => {
      const res = getLocalData(query);
      if (res) resolve(res); else reject(Error('Something goes wrong'));
    });
  }

  // prod data
  // TODO
  return new Promise();
};
