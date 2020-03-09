import firebase from 'firebase';
import { sortBy, reverse, keys, union } from 'lodash';

import { matchesSearch, getCompanyLogo, snapshotToArray, getLocalData } from './utils';
import { getLevelForContributionCount } from './Levels';
import config from './config';
import { isV1, defaultAccessor, DISTANCE_TO_TACK } from '../constants';

firebase.initializeApp(config);
const db = firebase.database();

/**
 * Prepare both data (real and local) for the Board component
 */
const getFormattedData = (snapshot, query = undefined, startsWithSearch) => {
  const data = [];
  let projectKeys = [];
  const overallDataLength = snapshot.length;
  const totalCount = isV1
    ? { contributions: 0, distance: 0 }
    : {
      projectContributionCount: 0,
      groupContributionCount: 0,
      taskContributionCount: 0,
    };

  snapshot.forEach((datum, index) => {
    const {
      username,
      // v1 fields
      contributions = 0,
      distance = 0,
      // v2 fields
      taskContributionCount = 0,
      projectContributionCount = 0,
      groupContributionCount = 0,
    } = datum;

    const taskContribution = isV1 ? distance / DISTANCE_TO_TACK : taskContributionCount;
    const level = getLevelForContributionCount(taskContribution);
    const logo = getCompanyLogo(username);

    if (!query || matchesSearch(username, query, startsWithSearch)) {
      const additionalData = isV1
        ? { contributions, distance }
        : {
          taskContributionCount,
          projectContributionCount,
          groupContributionCount,
        };

      data.push({ ...additionalData, username, logo, level, rank: index + 1 });
      // v1 totalCount
      totalCount.contributions += contributions;
      totalCount.distance += distance;
      // v2 totalCount
      projectKeys = union(totalCount.projectKeys, keys(contributions));
      totalCount.taskContributionCount += taskContributionCount;
      totalCount.projectContributionCount += projectKeys.length;
      totalCount.groupContributionCount += groupContributionCount;
    }
  });

  return { data, totalCount, overallDataLength };
};

const getDevData = (query = '', startsWithSearch = true) => (
  new Promise((resolve, reject) => {
    const localData = getLocalData();
    const res = getFormattedData(
      reverse(sortBy(localData, defaultAccessor)),
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
