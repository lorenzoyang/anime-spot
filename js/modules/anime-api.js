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
const maxLimit = 25;
// numero massimo di risultati che possono essere restituiti in una singola richiesta
export const maxQuantity = 30;

export async function getTopAnimes(parameters = {}, quantity = maxQuantity) {
    let animeList = [];

    let page = 1;
    while (quantity > 0) {
        const curruntLimit = quantity > maxLimit ? maxLimit : quantity;
        quantity -= curruntLimit;

        const url = createUrlQuery("top/anime", page, curruntLimit, parameters);

        const response = await fetch(url);
        const jsonData = await response.json();

        animeList = animeList.concat(jsonData.data);

        page++;
    }
    return animeList;
}

// ****************************************************************************************************
// ****************************************************************************************************
// helper functions
// ****************************************************************************************************
// ****************************************************************************************************

// url di base
const baseUrl = "https://api.jikan.moe/v4/";

// serie tv, film, Original Video Animation, speciale, Original Net Animation, musica
const validTypes = ["tv", "movie", "ova", "special", "ona", "music"];

// airing = in corso, upcoming = in arrivo, bypopularity = per popolarità, favorite = preferiti
const validFilters = ["airing", "upcoming", "bypopularity", "favorite"];

function createUrlQuery(
    resourcePath,
    page,
    quantity = maxLimit,
    parameters = {}
) {
    const { type, filter } = parameters;

    // controllo parametri
    if (page < 1) {
        throw new Error(`Invalid page: ${page}`);
    }
    if (quantity < 1 || quantity > maxLimit) {
        throw new Error(`Invalid quantity: ${quantity}`);
    }
    if (type && !validTypes.includes(type)) {
        throw new Error(`Invalid type: ${type}`);
    }
    if (filter && !validFilters.includes(filter)) {
        throw new Error(`Invalid filter: ${filter}`);
    }

    // creazione query
    const url = new URL(baseUrl + resourcePath);
    const searchParams = url.searchParams;

    // aggiunta parametri
    searchParams.set("page", page);
    searchParams.set("limit", quantity);
    if (type) {
        searchParams.set("type", type);
    }
    if (filter) {
        searchParams.set("filter", filter);
    }

    return url.toString();
}
