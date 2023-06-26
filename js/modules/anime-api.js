/**
 * This module provides functions for making requests
 * to the Jikan API to retrieve anime data.
 * to the Animechan API to retrieve anime quotes.
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
 * ============================================================================================================================================
 *
 * ! Animechan API
 * ? Site: https://animechan.vercel.app/
 *    ! new site: https://animechan.xyz/
 *
 * ? API documentation: https://animechan.vercel.app/docs
 *    ! new documentation: https://animechan.xyz/docs
 *
 * ? Important Notes
 * * Default rate limit is 100 requests per hour.
 * * Default number of quotes returned from query endpoints is 10.
 *
 */

import * as Utils from "./utils.js";

/**
 * The maximum number of anime results per page.
 *
 * @global
 *
 * @constant
 * @type {number}
 *
 */
const MAX_LIMIT = 25;

/**
 * Gets the top anime list.
 * Retrieves the top anime list from the Jikan API.
 *
 * @async
 *
 * @param {number} page - The page number.
 * @param {string} filter - The type of filter to apply to the results.
 *
 * @throws {Error} If the request fails.
 *
 * @returns {Promise<Object>} A Promise that resolves to an object containing the top anime data and a boolean indicating if there is a next page.
 */
async function getTopAnimes(page, filter) {
  const url = createUrlQuery(jikanBaseUrl, "/top/anime", {
    page: page,
    filter: filter,
    limit: MAX_LIMIT,
  });

  const jsonResponse = await makeHttpRequest(url);

  Utils.debug(`called`, jsonResponse.data[0], { properties: ["title"] });

  return {
    data: jsonResponse.data,
    hasNextPage: jsonResponse.pagination.has_next_page,
  };
}

/**
 * This function retrieves anime data by ID.
 *
 * @async
 *
 * @param {number} id - The ID of the anime to retrieve data for.
 * @param {boolean} full - Whether or not to retrieve full data for the anime.
 *
 * @returns {Object} - The JSON response data for the given anime.
 */
async function getAnimeById(id, full = false) {
  const url = full
    ? createUrlQuery(jikanBaseUrl, `/anime/${id}/full`)
    : createUrlQuery(jikanBaseUrl, `/anime/${id}`);

  const jsonResponse = await makeHttpRequest(url);

  Utils.debug(`called`, jsonResponse.data[0], { properties: ["title"] });

  return jsonResponse.data;
}

/**
 * Searches for anime by name.
 *
 * @async
 *
 * @param {string} name - The name of the anime to search for.
 *
 * @throws {Error} If the search fails.
 *
 * @returns {Promise<Array>} A Promise that resolves to an array of anime data. 25 items per search.
 */
async function searchAnimeByName(name) {
  const url = createUrlQuery(jikanBaseUrl, "/anime", {
    q: name,
  });

  const jsonResponse = await makeHttpRequest(url);

  Utils.debug(`called`, jsonResponse.data[0], { properties: ["title"] });

  return jsonResponse.data;
}

/**
 * Retrieves a random anime quote from the Animechan API.
 *
 * @async
 *
 * @returns {Promise<object>} - A Promise that resolves to a JSON object containing the anime, character, and quote.
 */
async function getRandomAnimeQuote() {
  const url = createUrlQuery(animechanBaseUrl, "/random");

  const jsonResponse = await makeHttpRequest(url);

  Utils.debug(`called`, jsonResponse);

  return jsonResponse;
}

/**
 * Gets a random quote related to the provided anime title from the Animechan API.
 *
 * @async
 *
 * @param {string} animeTitle - The title of the anime to get a quote for.
 *
 * @returns {Promise<object>} - A Promise that resolves to an object with the anime, character, and quote properties of the fetched quote.
 */
async function getRandomQuoteByAnime(animeTitle) {
  const url = createUrlQuery(animechanBaseUrl, "/random/anime", {
    title: animeTitle,
  });

  const jsonResponse = await makeHttpRequest(url);

  Utils.debug(`called`, jsonResponse);

  return jsonResponse;
}

// * ======================================================================================================================================
// * private functions
// * ======================================================================================================================================

// url di base
const jikanBaseUrl = "https://api.jikan.moe/v4";
// const animechanBaseUrl = "https://animechan.vercel.app/api";
// ! new base url
const animechanBaseUrl = "https://animechan.xyz/api";

// serie tv, film, Original Video Animation, speciale, Original Net Animation, musica
const validTypes = ["tv", "movie", "ova", "special", "ona", "music"];

// airing = in corso, upcoming = in arrivo, bypopularity = per popolarità, favorite = preferiti
const validFilters = ["airing", "upcoming", "bypopularity", "favorite"];

/**
 * Creates a URL query string for the given base URL, resource path, and parameters.
 *
 * @param {string} baseUrl - The base URL to use for the query.
 * @param {string} resourcePath - The resource path to append to the URL.
 * @param {object} [parameters={}] - An optional object containing parameters to include in the query string.
 * @param {number} [parameters.page] - The page number to retrieve, if specified.
 * @param {number} [parameters.limit] - The number of results to retrieve, if specified.
 * @param {string} [parameters.type] - The type of result to retrieve, if specified.
 * @param {string} [parameters.filter] - The filter to apply to the results, if specified.
 * @param {string} [parameters.q] - The name to search for, if specified.
 * @param {string} [parameters.title] - The title of the anime to search for, (only used with animechanBaseUrl). If specified.
 *
 * @returns {string} - The complete URL query as a string.
 *
 * @throws {Error} - Throws an error if any of the provided parameters are invalid.
 */
function createUrlQuery(baseUrl, resourcePath, parameters = {}) {
  const url = new URL(baseUrl + resourcePath);
  const searchParams = url.searchParams;

  if (baseUrl === jikanBaseUrl) {
    const { page, limit, type, filter, q } = validateParameters(
      baseUrl,
      parameters
    );

    if (page) {
      searchParams.set("page", page);
    }
    if (limit) {
      searchParams.set("limit", limit);
    }
    if (type) {
      searchParams.set("type", type);
    }
    if (filter) {
      searchParams.set("filter", filter);
    }
    if (q) {
      searchParams.set("q", q);
    }
  } else if (baseUrl === animechanBaseUrl) {
    const { title } = validateParameters(baseUrl, parameters);

    if (title) {
      searchParams.set("title", title);
    }
  } else {
  }

  Utils.debug(url.toString());

  return url.toString();
}

/**
 * Validates the provided parameters based on the provided baseUrl.
 *
 * @param {string} baseUrl - The base URL to validate against.
 * @param {object} parameters - An object containing the parameters to validate.
 * @param {number} [parameters.page] - The page number to retrieve, if specified.
 * @param {number} [parameters.limit] - The limit of results per page, if specified.
 * @param {string} [parameters.type] - The type of result to retrieve, if specified.
 * @param {string} [parameters.filter] - The filter to apply to the results, if specified.
 * @param {string} [parameters.q] - The name to search for, if specified.
 *
 * @returns {object} - An object containing the validated parameters.
 * @property {number} [page] - The validated page number.
 * @property {number} [limit] - The validated number of results to retrieve.
 * @property {string} [type] - The validated result type.
 * @property {string} [filter] - The validated filter to apply to the results.
 * @property {string} [q] - The validated name to search for.
 *
 * @throws {Error} - Throws an error if any of the provided parameters are invalid.
 */
function validateParameters(baseUrl, parameters) {
  if (baseUrl === jikanBaseUrl) {
    const { page, limit, type, filter, q } = parameters;

    if (page && page < 1) {
      throw new Error(`Invalid page: ${page}`);
    }
    if (limit < 1 || limit > MAX_LIMIT) {
      throw new Error(`Invalid limit: ${limit}`);
    }
    if (type && !validTypes.includes(type)) {
      throw new Error(`Invalid type: ${type}`);
    }
    if (filter && !validFilters.includes(filter)) {
      throw new Error(`Invalid filter: ${filter}`);
    }
    if (q && typeof q !== "string") {
      throw new Error(`Invalid q (name): ${q}`);
    }

    Utils.debug(
      `page:${page}, limit:${limit}, type:${type}, filter:${filter}, q:${q}`
    );

    return { page, limit, type, filter, q };
  } else if (baseUrl === animechanBaseUrl) {
    const { title } = parameters;

    if (title && typeof title !== "string") {
      throw new Error(`Invalid title: ${title}`);
    }

    Utils.debug(`title (anime name): ${title}`);

    return { title };
  } else {
    throw new Error(`Invalid baseUrl: ${baseUrl}`);
  }
}

/**
 * Sends an HTTP GET request to the specified URL and returns the response as JSON.
 *
 * @async
 *
 * @param {string} url - The URL to send the request to.
 *
 * @returns {Promise<object>} - A promise that resolves to the response data as a JSON object.
 *
 * @throws {Error} - Throws an error if the response status is not OK.
 */
async function makeHttpRequest(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `HTTP error: ${response.status}, message: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`Could not get data: ${error}`);
  }
}

// Export the variables and functions for use in other modules.
export {
  MAX_LIMIT,
  getTopAnimes,
  getAnimeById,
  searchAnimeByName,
  getRandomAnimeQuote,
  getRandomQuoteByAnime,
};
