// localStorageStates.js

/* Media functions */
// Store media states in localStorage
export const setLocalMediaStates = (id, settings) => {
  localStorage.setItem(`media_${id}_settings`, JSON.stringify(settings));
};

// Retrieve media states from localStorage
export const getLocalMediaStates = (id) => {
  const settings = localStorage.getItem(`media_${id}_settings`);
  return settings ? JSON.parse(settings) : null;
};