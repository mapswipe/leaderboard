import firebase from 'firebase';
import { reduce, size } from 'lodash';

import { matchesSearch, getCompanyLogo, snapshotToArray, getLocalData } from './utils';
import { getLevelForContributionCount } from './Levels';
import { basicSort } from './sortFunctions';
import config from './config';
import { isV1, DISTANCE_TO_TACK } from '../constants';

firebase.initializeApp(config);
const db = firebase.database();

// Convert a users contributions to a number (on the v2 records)
const formatV2Contribution = contributions => reduce(
  contributions,
  (acc, val) => acc + size(val),
  0,
);

/**
 * Prepare both data (real and local) for the Board component
 */
const getFormattedData = (snapshot, query = undefined, startsWithSearch) => {
  const data = [];
  const overallDataLength = snapshot.length;
  let totalContributions = 0;
  let totalDistance = 0;

  snapshot.forEach((datum, index) => {
    const { username, taskContributionCount = 0 } = datum;
    let { contributions, distance } = datum;

    contributions = isV1 ? contributions : formatV2Contribution(contributions);
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
    const localData = getLocalData();
    const res = getFormattedData(
      localData.sort((a, b) => basicSort(a, b, 'distance')),
      query,
      startsWithSearch,
    );

    if (res) {
      resolve(res);
    } else {
      reject(Error('Something goes wrong'));
    }
  })
);

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
 * @param query string
 * @return Promise of all Users data where User username match with query
 */
export const getUsersPromise = (process.env.REACT_APP_SOURCE === 'dev') ? getDevData : getProdData;
