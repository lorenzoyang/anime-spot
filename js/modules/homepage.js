/**
 * Module for providing homepage functionality
 *
 * @module Homepage
 */

import * as AnimeApi from "./anime-api.js";
import * as AnimeContainer from "./anime-container.js";

/**
 * Radio button object containing all radio buttons in the HTML
 *
 * @typedef {Object} RadioButtons
 * @property {HTMLElement} airing - The airing radio button element
 * @property {HTMLElement} upcoming - The upcoming radio button element
 * @property {HTMLElement} favorite - The favorite radio button element
 * @property {HTMLElement} bypopularity - The by popularity radio button element
 */

/**
 * Object containing all radio buttons in the HTML
 *
 * @type {RadioButtons}
 */
const radioBtns = {
    airing: document.querySelector("#option1-airing"),
    upcoming: document.querySelector("#option2-upcoming"),
    favorite: document.querySelector("#option3-favorite"),
    bypopularity: document.querySelector("#option4-popularity"),
};

/**
 * Returns the selected radio button from the given radio button object
 *
 * @param {RadioButtons} radioBtns - The object containing all radio buttons in the HTML
 *
 * @returns {string} - The selected radio button
 *
 * @throws {Error} - If no radio button is selected
 */
function getRadioBtnSelection(radioBtns) {
    switch (true) {
        case radioBtns.airing.checked:
            return "airing";
        case radioBtns.upcoming.checked:
            return "upcoming";
        case radioBtns.favorite.checked:
            return "favorite";
        case radioBtns.bypopularity.checked:
            return "bypopularity";
        default:
            throw new Error("Invalid radio button selection");
    }
}

/**
 * Object containing cached anime list information
 *
 * @typedef {Object} AnimeListCache
 * @property {Array} animeList - The cached anime list for the category
 * @property {number} page - The current page of the cached anime list for the category
 * @property {boolean} hasNextPage - Indicates whether there is more data to be fetched for the category
 */

/**
 * Object containing cached anime list information
 *
 * @typedef {Object} AnimeCache
 * @property {AnimeListCache} airing - The cached anime list for the "airing" category
 * @property {AnimeListCache} upcoming - The cached anime list for the "upcoming" category
 * @property {AnimeListCache} favorite - The cached anime list for the "favorite" category
 * @property {AnimeListCache} bypopularity - The cached anime list for the "bypopularity" category
 * @property {AnimeListCache} searchResult - The cached anime list for the search results
 */
const animeCache = {
    airing: { animeList: [], page: 1, hasNextPage: true },
    upcoming: { animeList: [], page: 1, hasNextPage: true },
    favorite: { animeList: [], page: 1, hasNextPage: true },
    bypopularity: { animeList: [], page: 1, hasNextPage: true },

    searchResult: { animeList: [] },
};

/**
 * Initializes the homepage by fetching the anime list for the "airing" category and displaying it on the page.
 *
 * @async
 *
 * @returns {Promise<void>} A Promise that resolves when the anime list has been fetched and displayed.
 */
async function initHomepage() {
    await lazyLoadAnimeList("airing");
    AnimeContainer.displayAnimeCards(animeCache.airing.animeList);
}

/**
 * Loads anime list data for a given filter if it hasn't been cached yet
 *
 * @async
 *
 * @param {string} filter - The filter to use for loading anime list data
 *
 * @returns {Promise<void>}
 */
async function lazyLoadAnimeList(filter) {
    if (animeCache[filter].animeList.length === 0) {
        const result = await AnimeApi.getTopAnimes(
            animeCache[filter].page,
            filter
        );
        animeCache[filter].animeList = result.data;
        animeCache[filter].page++;
        animeCache[filter].hasNextPage = result.hasNextPage;
    }
}

/**
 * Updates anime cards based on the selected radio button.
 *
 * @async
 *
 * @returns {Promise<void>}
 */
async function updateAnimeCardsOnRadioBtn() {
    let filter = getRadioBtnSelection(radioBtns);
    await lazyLoadAnimeList(filter);
    AnimeContainer.displayAnimeCards(animeCache[filter].animeList);
}

/**
 * Expands the anime list for a given filter by retrieving the next page of results from the API.
 *
 * @param {string} filter - The filter for which to expand the anime list.
 *
 * @returns {Promise<void>}
 */
async function expandAnimeList(filter) {
    if (animeCache[filter].hasNextPage) {
        let result = await AnimeApi.getTopAnimes(
            animeCache[filter].page,
            filter
        );

        animeCache[filter].animeList = animeCache[filter].animeList.concat(
            result.data
        );
        animeCache[filter].page++;
        animeCache[filter].hasNextPage = result.hasNextPage;
    }
}

/**
 * Expands the anime cards based on the selected radio button by fetching the next page of anime results
 * for the selected filter and displaying them.
 *
 * @async
 *
 * @returns {Promise<void>} - A Promise that resolves when the anime cards are expanded and displayed.
 */
async function expandAnimeCardsOnRadioBtn() {
    let filter = getRadioBtnSelection(radioBtns);
    const oldLength = animeCache[filter].animeList.length;
    await expandAnimeList(filter);
    AnimeContainer.displayAnimeCards(animeCache[filter].animeList, oldLength);
}

// * ====================================================================================================
// * anime card
// * ====================================================================================================

/**
 * A template string representing the HTML structure for an anime card.
 * The image source and alt text, as well as the card text, should be populated dynamically.
 *
 * @type {string}
 */
const ANIME_CARD_TEMPLATE = `
    <div class="card shadow-sm h-100 clickable-card">
        <img
            src=""
            alt=""
            class="card-img-top img-fluid"
        />
        <div class="card-body">
            <p class="card-text"></p>
        </div>
    </div>
`;

/**
 * A callback function for displaying an anime card with the provided anime data.
 *
 * @param {HTMLElement} card - The HTML element representing the anime card.
 * @param {object} anime - The anime data to be displayed on the card.
 */
function animeCardContentCallback(card, anime) {
    const MAX_TITLE_LENGTH = 18;
    const img = card.querySelector("img");
    const title = card.querySelector(".card-text");

    img.src = anime.images.jpg.large_image_url;
    img.alt = anime.title;

    const animeTitle =
        anime.title.length > MAX_TITLE_LENGTH
            ? anime.title.substring(0, MAX_TITLE_LENGTH) + "..."
            : anime.title;
    title.innerHTML = `<strong>${animeTitle}</strong>`;
}

// Export the variables and functions for use in other modules.
export {
    radioBtns,
    initHomepage,
    updateAnimeCardsOnRadioBtn,
    expandAnimeCardsOnRadioBtn,
    ANIME_CARD_TEMPLATE,
    animeCardContentCallback,
};
