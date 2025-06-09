// localStorageStates.js
import { auth } from '../firebase/firebase-auth';

function getStorageKey() {
  const user = auth.currentUser;
  return user ? `user_${user.uid}` : 'default_key';
}

function getStorageObject() {
  try {
    const item = localStorage.getItem(getStorageKey());
    return item ? JSON.parse(item) : {};
  } catch {
    return {};
  }
}

function setStorageObject(obj) {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(obj));
  } catch {
    // Fail silently or handle quota exceeded errors here if needed
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