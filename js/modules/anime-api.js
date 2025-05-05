/**
 * This module provides functions for making requests
 * to the Jikan API to retrieve anime data.
 *
 * @module AnimeApi
 */

/**
 *
 * ! Jikan API
 * ? Site: https://jikan.moe/
 * ? API documentation: https://docs.api.jikan.moe/
 *
 * ? JSON notes
 * * Any property (except arrays or objects) whose value does not exist or is undetermined, will be null.
 * * Any array or object property whose value does not exist or is undetermined, will be empty.
 * * Any score property whose value does not exist or is undetermined, will be 0.
 * * All dates and timestamps are returned in ISO8601 format and in UTC timezone
 *
 * ? API notes
 * * limit is the number of results per page, max is 25, if not specified, default is 25
 * * page is the page number, if not specified, default is 1
 *
 * La "pagination" si riferisce alla suddivisione dei risultati in pagine più piccole. Ad esempio,
 * se si richiedono 100 risultati, l'API potrebbe dividersi in 10 pagine da 10 risultati ciascuna.
 * Ciò consente di ottenere solo i risultati necessari in una sola richiesta invece di dover scaricare l'intero set di dati in una sola volta.
 *
 * Il "limit" si riferisce invece al numero massimo di risultati restituiti in una singola richiesta.
 * Ad esempio, se si impostano "limit" su 20, l'API restituirà solo i primi 20 risultati.
 * Questo può essere utile se si desidera limitare il tempo di risposta dell'API o se si desidera solo un numero limitato di risultati.
 *
 */

import * as Utils from "./utils.js";

/**
 * Configuration constants
 */
const CONFIG = {
  BASE_URL: "https://api.jikan.moe/v4",
  MAX_LIMIT: 25,
  VALID_TYPES: ["tv", "movie", "ova", "special", "ona", "music"],
  VALID_FILTERS: ["airing", "upcoming", "bypopularity", "favorite"],
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // Base delay for retries in ms
};

/**
 * Creates a URL for the Jikan API with query parameters
 * @param {string} path - API endpoint path
 * @param {Object} params - Query parameters
 * @returns {string} - Complete URL
 */
function createApiUrl(path, params = {}) {
  const url = new URL(CONFIG.BASE_URL + path);

  validateParameters(params);
  // Add valid parameters to URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  Utils.debug(`Created URL: ${url.toString()}`);
  return url.toString();
}

/**
 * Validates API request parameters
 * @param {Object} params - Parameters to validate
 * @returns {Object} - Validated parameters
 * @throws {Error} - If parameters are invalid
 */
function validateParameters(params) {
  const { page, limit, type, filter, q } = params;

  // Validation checks
  if (page !== undefined && (page < 1 || !Number.isInteger(Number(page)))) {
    throw new Error(`Invalid page: ${page}`);
  }

  if (
    limit !== undefined &&
    (limit < 1 || limit > CONFIG.MAX_LIMIT || !Number.isInteger(Number(limit)))
  ) {
    throw new Error(`Invalid limit: ${limit} (max: ${CONFIG.MAX_LIMIT})`);
  }

  if (type !== undefined && !CONFIG.VALID_TYPES.includes(type)) {
    throw new Error(
      `Invalid type: ${type}. Valid types: ${CONFIG.VALID_TYPES.join(", ")}`
    );
  }

  if (filter !== undefined && !CONFIG.VALID_FILTERS.includes(filter)) {
    throw new Error(
      `Invalid filter: ${filter}. Valid filters: ${CONFIG.VALID_FILTERS.join(
        ", "
      )}`
    );
  }

  if (q !== undefined && (typeof q !== "string" || q.trim() === "")) {
    throw new Error(`Invalid search query: ${q}`);
  }

  return params;
}

/**
 * Makes an HTTP request with retry logic and error handling
 * @param {string} url - URL to fetch
 * @returns {Promise<Object>} - JSON response
 */
async function fetchWithRetry(url) {
  let lastError;

  for (let attempt = 0; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get("Retry-After") || "5",
          10
        );
        Utils.debug(`Rate limited. Retrying after ${retryAfter} seconds.`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      // Handle other errors
      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status}, message: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.message.includes("HTTP error: 4")) {
        throw error;
      }

      // Exponential backoff for retries
      if (attempt < CONFIG.MAX_RETRIES) {
        const delay = CONFIG.RETRY_DELAY * Math.pow(2, attempt);
        Utils.debug(
          `Request failed (attempt ${attempt + 1}/${
            CONFIG.MAX_RETRIES + 1
          }). Retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Request failed after multiple attempts");
}

/**
 * Gets the top anime list from the Jikan API.
 *
 * @async
 * @param {number} page - The page number.
 * @param {string} filter - The type of filter to apply to the results.
 * @returns {Promise<Object>} - Top anime data with pagination info
 */
async function getTopAnimes(page = 1, filter = "bypopularity") {
  const url = createApiUrl("/top/anime", {
    page,
    filter,
    limit: CONFIG.MAX_LIMIT,
  });

  const jsonResponse = await fetchWithRetry(url);

  const result = {
    data: jsonResponse.data,
    hasNextPage: jsonResponse.pagination.has_next_page,
    pagination: jsonResponse.pagination,
  };

  if (jsonResponse.data.length > 0) {
    Utils.debug(
      `Fetched top anime with filter: ${filter}, page: ${page}`,
      jsonResponse.data[0],
      { properties: ["title"] }
    );
  } else {
    Utils.debug(
      `Fetched top anime with filter: ${filter}, page: ${page} - No results`
    );
  }

  return result;
}

/**
 * Retrieves anime data by ID.
 *
 * @async
 * @param {number} id - The ID of the anime.
 * @param {boolean} full - Whether to retrieve full data.
 * @returns {Promise<Object>} - Anime data
 */
async function getAnimeById(id, full = false) {
  if (!id || isNaN(parseInt(id))) {
    throw new Error(`Invalid anime ID: ${id}`);
  }

  const path = `/anime/${id}${full ? "/full" : ""}`;
  const url = createApiUrl(path);

  const jsonResponse = await fetchWithRetry(url);

  Utils.debug(`Fetched anime by ID: ${id}, full: ${full}`, jsonResponse.data, {
    properties: ["title"],
  });

  return jsonResponse.data;
}

/**
 * Searches for anime by name.
 *
 * @async
 * @param {string} name - The name to search for.
 * @param {number} [limit=CONFIG.MAX_LIMIT] - Maximum number of results
 * @returns {Promise<Array>} - Array of anime data
 */
async function searchAnimeByName(name, limit = CONFIG.MAX_LIMIT) {
  if (!name || typeof name !== "string") {
    throw new Error("Search name is required");
  }

  const normalizedQuery = name.trim().toLowerCase();

  const url = createApiUrl("/anime", {
    q: normalizedQuery,
    limit,
  });

  const jsonResponse = await fetchWithRetry(url);

  if (jsonResponse.data.length > 0) {
    Utils.debug(
      `Searched anime by name: ${normalizedQuery}`,
      jsonResponse.data[0],
      { properties: ["title"] }
    );
  } else {
    Utils.debug(`Searched anime by name: ${normalizedQuery} - No results`);
  }

  return jsonResponse.data;
}

export { CONFIG, getTopAnimes, getAnimeById, searchAnimeByName };
