// Utility functions for storing and retrieving media settings from localStorage

// Store media settings in localStorage
export const storeMediaStateSettings = (id, settings) => {
  localStorage.setItem(`media_${id}_settings`, JSON.stringify(settings));
};

// Retrieve media settings from localStorage
export const getMediaStateSettings = (id) => {
  const settings = localStorage.getItem(`media_${id}_settings`);
  return settings ? JSON.parse(settings) : null;
};