// sessionStates.js
const SESSION_KEY = 'pageStates';

function getSessionObject() {
  return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || {};
}

function setSessionObject(obj) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(obj));
}

// Accepts variable arguments: getSessionValue('HomeUI', 'Grids', 'TrendingGrid', 'MoviesScrollState')
export function getSessionValue(...path) {
  let obj = getSessionObject();
  for (let key of path) {
    if (obj == null || typeof obj !== 'object') return undefined;
    obj = obj[key];
  }
  return obj;
}

// Accepts variable arguments: setSessionValue('HomeUI', 'Grids', 'ProvidersGrid', 'Providers', 'selectedProvider', value)
export function setSessionValue(...args) {
  const value = args.pop(); // Last item is the value
  const keys = args;
  const lastKey = keys.pop();

  let obj = getSessionObject();
  let nested = obj;

  for (let key of keys) {
    if (!nested[key] || typeof nested[key] !== 'object') {
      nested[key] = {};
    }
    nested = nested[key];
  }

  nested[lastKey] = value;
  setSessionObject(obj);
}