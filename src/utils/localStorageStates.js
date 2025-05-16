// localStorageStates.js

/* Media functions */
// Store media local settings in localStorage
export const setLocalStorageMediaStates = (id, settings) => {
  localStorage.setItem(`media_${id}_settings`, JSON.stringify(settings));
};

// Retrieve media local settings from localStorage
export const getLocalStorageMediaStates = (id) => {
  const settings = localStorage.getItem(`media_${id}_settings`);
  return settings ? JSON.parse(settings) : null;
};