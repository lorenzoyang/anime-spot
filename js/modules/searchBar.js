/**
 * Module for providing search bar functionality
 *
 * @module SearchBar
 */

import * as AnimeApi from "./anime-api.js";

/**
 * Cache object to store query and search results for future use
 *
 * @typedef {Object} Cache
 * @property {string} query - The last search query made
 * @property {Array} searchResults - The search results for the last query
 */
const cache = { query: "", searchResults: [] };

/**
 * Get anime search results based on the search bar input value
 *
 * @async
 *
 * @param {HTMLElement} searchBar - The search bar input element
 *
 * @returns {Promise<Array>} - A promise that resolves with an array of anime search results
 */
async function getAnimeSearchResults(searchBar) {
  const query = searchBar.value.trim().toLowerCase();

  if (cache.query === query) {
    return cache.searchResults;
  }

  const searchResults = await AnimeApi.searchAnimeByName(query);

  cache.query = query;
  cache.searchResults = searchResults;

  return searchResults;
}

// Export the variables and functions for use in other modules.
export { getAnimeSearchResults };
