// localStorageStates.js
const STORAGE_KEY = 'default_key';

function getStorageObject() {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : {};
  } catch {
    return {};
  }
}

function setStorageObject(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // Optionally handle quota errors
  }
}

// Store all states from localStorage
export function getStorageValue(...path) {
  let obj = getStorageObject();
  for (let key of path) {
    if (obj == null || typeof obj !== 'object') return undefined;
    obj = obj[key];
  }
  return obj;
}

// Retrieve all states from localStorage
export function setStorageValue(...args) {
  const value = args.pop(); // Last item is the value
  const keys = args;
  const lastKey = keys.pop();

  let obj = getStorageObject();
  let nested = obj;

  for (let key of keys) {
    if (!nested[key] || typeof nested[key] !== 'object') {
      nested[key] = {};
    }
    nested = nested[key];
  }

  nested[lastKey] = value;
  setStorageObject(obj);
}

// Remove all states from localStorage state
export function removeStorageValue(...path) {
  if (path.length === 0) return;

  const keys = [...path];
  const lastKey = keys.pop();

  let obj = getStorageObject();
  let nested = obj;

  for (const key of keys) {
    if (!nested[key] || typeof nested[key] !== 'object') {
      return;
    }
    nested = nested[key];
  }

  if (nested && Object.prototype.hasOwnProperty.call(nested, lastKey)) {
    delete nested[lastKey];
    setStorageObject(obj);
  }
}

// Completely removes all application state stored under the default localStorage key.
// Use this when a full cleanup is required, such as during user sign-out.
export function clearStorageState() {
  localStorage.removeItem('default_key');
}