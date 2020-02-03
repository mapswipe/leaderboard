import { reverse, sortBy } from 'lodash';

import { invalidUsers, isV1, defaultAccessor } from '../constants';
import logoSalesForce from '../assets/companies/salesForce.png';
import logoMapSwipe from '../assets/companies/mapSwipe.png';

/**
 * @param str string which may includes pattern
 * @param pattern string
 * @param startsWithSearch bool that indicate if str should starts with
 *         pattern or just be includes it
 * @return bool
 */
export const matchesSearch = (str, pattern, startsWithSearch) => startsWithSearch
  ? str.toLowerCase().startsWith(pattern.toLowerCase())
  : str.toLowerCase().includes(pattern.toLowerCase());

/**
 * @param username string
 * @return the logo of the user's company. By default mapSwipe's logo
 */
export const getCompanyLogo = (username) => {
  switch (username) {
    case (username.match(/^sf_/i) || {}).input: return logoSalesForce;
    default: return logoMapSwipe;
  }
};

/**
 * Convert Firebase API call result to an array
 * Trim also the username and sort the result by `distance`
 */
export const snapshotToArray = (snapshot) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot) => {
    let val = childSnapshot.val();
    const username = val.username ? val.username.trim() : '';
    val = { ...val, username };
    if (!invalidUsers.includes(username)) returnArr.push(val);
  });

  return reverse(sortBy(returnArr, defaultAccessor));
};

/**
 * Return local data located at `src/lib/json`
 */
export const getLocalData = () => {
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

  return localData.filter(({ username }) => username);
};
