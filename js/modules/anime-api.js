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

// limite massimo di risultati per pagina
export const MAX_LIMIT = 25;
// numero massimo di risultati che possono essere restituiti in una singola richiesta
export const MAX_COUNT = 50;

export async function getTopAnimes(filter, count = MAX_COUNT) {
    let animeList = [];

    let page = 1;
    while (count > 0) {
        const curruntLimit = count > MAX_LIMIT ? MAX_LIMIT : count;
        count -= curruntLimit;

        const url = createUrlQuery("/top/anime", {
            page: page,
            limit: curruntLimit,
            filter: filter,
        });

        const response = await fetch(url);
        const jsonData = await response.json();

        animeList = animeList.concat(jsonData.data);

        page++;
    }
    return animeList;
}

export async function getAnimeByName(name) {
    const url = createUrlQuery("/anime", { name: name });
    const response = await fetch(url);
    const jsonData = await response.json();

    console.log(jsonData);
}

// ****************************************************************************************************
// ****************************************************************************************************
// helper functions
// ****************************************************************************************************
// ****************************************************************************************************

// url di base
const baseUrl = "https://api.jikan.moe/v4";

// serie tv, film, Original Video Animation, speciale, Original Net Animation, musica
const validTypes = ["tv", "movie", "ova", "special", "ona", "music"];

// airing = in corso, upcoming = in arrivo, bypopularity = per popolarità, favorite = preferiti
const validFilters = ["airing", "upcoming", "bypopularity", "favorite"];

function createUrlQuery(resourcePath, parameters = {}) {
    const { page, limit, type, filter, name } = parameters;

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
    if (name && typeof name !== "string") {
        throw new Error(`Invalid name: ${name}`);
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
    if (name) {
        searchParams.set("q", name);
    }
    console.log(url.toString());
    return url.toString();
}
