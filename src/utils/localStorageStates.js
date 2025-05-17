// localStorageStates.js

// Store media states in localStorage
export const setLocalMediaStates = (id, settings) => {
  localStorage.setItem(`media_${id}_states`, JSON.stringify(settings));
};

// Retrieve media states from localStorage
export const getLocalMediaStates = (id) => {
  const settings = localStorage.getItem(`media_${id}_states`);
  return settings ? JSON.parse(settings) : null;
};