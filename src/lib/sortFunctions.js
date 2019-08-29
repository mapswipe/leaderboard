export function basicSort(aObje, bObje, id, desc = true) {
  const bt = desc ? -1 : 1;
  const lt = desc ? 1 : -1;
  // force null and undefined to the bottom
  let a = aObje === null || aObje === undefined ? '' : aObje[id];
  let b = bObje === null || bObje === undefined ? '' : bObje[id];
  // force any string values to lowercase
  a = typeof a === 'string' ? a.toLowerCase() : a;
  b = typeof b === 'string' ? b.toLowerCase() : b;
  // Return either 1 or -1 to indicate a sort priority
  if (a > b) return bt;
  if (a < b) return lt;
  if (id === 'username') {
    a = aObje === null || aObje === undefined ? '' : aObje.distance;
    b = bObje === null || bObje === undefined ? '' : bObje.distance;
    if (a > b) return bt;
    if (a < b) return lt;
    a = aObje === null || aObje === undefined ? '' : aObje.contributions;
    b = bObje === null || bObje === undefined ? '' : bObje.contributions;
    if (a > b) return bt;
    if (a < b) return lt;
  }
  if (id === 'contributions') {
    a = aObje === null || aObje === undefined ? '' : aObje.distance;
    b = bObje === null || bObje === undefined ? '' : bObje.distance;
    if (a > b) return bt;
    if (a < b) return lt;
    a = aObje === null || aObje === undefined ? '' : (aObje.username && aObje.username.toLowerCase());
    b = bObje === null || bObje === undefined ? '' : (bObje.username && bObje.username.toLowerCase());
    if (a > b) return bt;
    if (a < b) return lt;
  }
  if (id === 'distance') {
    a = aObje === null || aObje === undefined ? '' : aObje.distance;
    b = bObje === null || bObje === undefined ? '' : bObje.distance;
    if (a > b) return bt;
    if (a < b) return lt;
    a = aObje === null || aObje === undefined ? '' : (aObje.username && aObje.username.toLowerCase());
    b = bObje === null || bObje === undefined ? '' : (bObje.username && bObje.username.toLowerCase());
    if (a > b) return bt;
    if (a < b) return lt;
  }
  return 0;
}
