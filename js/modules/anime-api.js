/**
 * This module provides functions for making requests to the Jikan API to retrieve anime data.
 *
 * @module AnimeApi
 */

/**
 * ? Site: https://jikan.moe/
 * ? API documentation: https://docs.api.jikan.moe/
 *
 * ! JSON notes
 * * Any property (except arrays or objects) whose value does not exist or is undetermined, will be null.
 * * Any array or object property whose value does not exist or is undetermined, will be empty.
 * * Any score property whose value does not exist or is undetermined, will be 0.
 * * All dates and timestamps are returned in ISO8601 format and in UTC timezone
 *
 * ! API notes
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

// limite massimo di risultati per pagina
/**
 * The maximum number of anime results per page.
 *
 * @global
 *
 * @constant
 * @type {number}
 *
 */
export const MAX_LIMIT = 25;

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
export async function getTopAnimes(page, filter) {
    const url = createUrlQuery("/top/anime", {
        page: page,
        filter: filter,
        limit: MAX_LIMIT,
    });

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}, message: ${response.statusText}`
            );
        }
        const jsonResponse = await response.json();

        Utils.debug(`called`);

        return {
            data: jsonResponse.data,
            hasNextPage: jsonResponse.pagination.has_next_page,
        };
    } catch (error) {
        console.error(`Could not get data: ${error}`);
    }
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
export async function searchAnimeByName(name) {
    const url = createUrlQuery("/anime", {
        q: name,
    });

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}, message: ${response.statusText}`
            );
        }
        const jsonResponse = await response.json();

        Utils.debug(`called`);

        return jsonResponse.data;
    } catch (error) {
        console.error(`Could not get data: ${error}`);
    }
}

// ****************************************************************************************************
// * helper functions
// ****************************************************************************************************

// url di base
const baseUrl = "https://api.jikan.moe/v4";

// serie tv, film, Original Video Animation, speciale, Original Net Animation, musica
const validTypes = ["tv", "movie", "ova", "special", "ona", "music"];

// airing = in corso, upcoming = in arrivo, bypopularity = per popolarità, favorite = preferiti
const validFilters = ["airing", "upcoming", "bypopularity", "favorite"];

/**
 * Creates a URL query string for a given resource path and parameters.
 *
 * @param {string} resourcePath - The path to the resource.
 * @param {Object} [parameters={}] - An optional object containing query parameters.
 * @param {number} [parameters.page] - The page number.
 * @param {number} [parameters.limit] - The maximum number of items to return.
 * @param {string} [parameters.type] - The type of item to return.
 * @param {string} [parameters.filter] - A filter to apply to the results.
 * @param {string} [parameters.q] - A search query to apply to the results.
 *
 * @throws {Error} If any of the parameters are invalid.
 *
 * @returns {string} The URL with the query string appended.
 */
function createUrlQuery(resourcePath, parameters = {}) {
    const { page, limit, type, filter, q } = parameters;

    // controllo dei parametri
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

    // creazione query
    const url = new URL(baseUrl + resourcePath);
    const searchParams = url.searchParams;

    // aggiunta parametri
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

    Utils.debug(url.toString());

    return url.toString();
}
