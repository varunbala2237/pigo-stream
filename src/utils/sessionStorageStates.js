// sessionStorageStates.js
const SESSION_KEY = 'default_key';

function getSessionObject() {
  return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || {};
}

function setSessionObject(obj) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(obj));
}

// Store all states from sessionStorage
export function getSessionValue(...path) {
  let obj = getSessionObject();
  for (let key of path) {
    if (obj == null || typeof obj !== 'object') return undefined;
    obj = obj[key];
  }
  return obj;
}

// Retrieve all states from sessionStorage
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

// Remove all states from sessionStorage state
export function removeSessionValue(...path) {
  if (path.length === 0) return;

  const keys = [...path];
  const lastKey = keys.pop();

  let obj = getSessionObject();
  let nested = obj;

  for (const key of keys) {
    if (!nested[key] || typeof nested[key] !== 'object') {
      return;
    }
    nested = nested[key];
  }

  if (nested && Object.prototype.hasOwnProperty.call(nested, lastKey)) {
    delete nested[lastKey];
    setSessionObject(obj);
  }
}