/**
 * Module for handling anime-related functionality in the UI.
 *
 * @module AnimeAlbum
 */

import * as AnimeApi from "./anime-api.js";
import * as Utils from "./utils.js";

/**
 * The maximum number of anime to retrieve per request.
 *
 * @global
 * @constant
 * @type {number}
 */
const COUNT = AnimeApi.MAX_LIMIT;

/**
 * An object representing the different anime filters available.
 * Each filter contains an array of anime, a page number, and a boolean indicating whether there are more pages to load.
 *
 * @global
 * @type {Object.<string, {animeList: Array, page: number, hasNextPage: boolean}>}
 */
const animeFilter = {
    airing: { animeList: [], page: 1, hasNextPage: true },
    upcoming: { animeList: [], page: 1, hasNextPage: true },
    favorite: { animeList: [], page: 1, hasNextPage: true },
    bypopularity: { animeList: [], page: 1, hasNextPage: true },
};

/**
 * Populates anime cards for a specific filter.
 *
 * @async
 *
 * @param {string} filter - The filter to apply to the anime list.
 *
 * @returns {Promise<void>}
 */
export async function populateAnimeCardsForFilter(filter) {
    if (animeFilter[filter].animeList.length === 0) {
        const result = await AnimeApi.getTopAnimes(
            animeFilter[filter].page,
            filter
        );
        animeFilter[filter].animeList = result.data;
        animeFilter[filter].page++;
        animeFilter[filter].hasNextPage = result.hasNextPage;
    }
    populateAnimeCards(animeFilter[filter].animeList);
}

/**
 * Populates anime cards in the UI with the provided anime list array.
 *
 * @param {Array} animeList - An array of anime objects.
 */
export function populateAnimeCardsForArray(animeList) {
    populateAnimeCards(animeList);
}

/**
 * Expands the anime cards for the given filter by requesting the next page of anime from the API
 * and appending the results to the existing anime list. Then it populates the anime cards for the
 * expanded list starting from the index corresponding to the last COUNT items.
 *
 * @async
 *
 * @param {string} filter - The filter used to search for anime.
 */
export async function expandAnimeCardsForFilter(filter) {
    if (animeFilter[filter].hasNextPage) {
        let result = await AnimeApi.getTopAnimes(
            animeFilter[filter].page,
            filter
        );

        animeFilter[filter].animeList = animeFilter[filter].animeList.concat(
            result.data
        );
        animeFilter[filter].page++;
        animeFilter[filter].hasNextPage = result.hasNextPage;

        populateAnimeCards(
            animeFilter[filter].animeList,
            animeFilter[filter].animeList.length - COUNT
        );
    }
}

/**
 * A function that handles displaying the anime modal window.
 *
 * @callback displayAnimeModal
 *
 * @param {object} anime - The anime data to display in the modal.
 *
 * @returns {void}
 */
let modalWindowHandler;

/**
 * Sets the handler function for displaying the anime modal window.
 *
 * @param {displayAnimeModal} handler - The function to call when displaying the modal window.
 *
 * @returns {void}
 */
export function setModalWindowHandler(handler) {
    modalWindowHandler = handler;
}

// ****************************************************************************************************
// * helper functions
// ****************************************************************************************************

/**
 * Get the anime list container element.
 *
 * @returns {Element} The anime list container element.
 */
function getAnimeListContainer() {
    return document.querySelector("#anime-list-container");
}

/**
 * Get all anime card elements within the anime list container.
 *
 * @returns {NodeList} A NodeList of all anime card elements.
 */
function getAnimeCards() {
    return getAnimeListContainer().querySelectorAll(".col");
}

/**
 * Populates anime cards with anime data from the provided list, starting from the specified index.
 * If the number of anime cards is less than the number of anime in the list, it will append new cards to the end of the list.
 * If the number of anime cards is greater than the number of anime in the list, it will remove excess cards from the end of the list.
 *
 * @param {Array} animeList - The list of anime objects to display.
 * @param {number} [start=0] - The index to start populating from.
 */
function populateAnimeCards(animeList, start = 0) {
    balanceAnimeCardsCount(animeList);

    Utils.debug("animeList.length and animeCards.length?", {
        predicate: () => animeList.length === getAnimeCards().length,
        passed: "animeList.length == animeCards.length",
        failed: "animeList.length != animeCards.length",
    });

    let cardIndex = start;
    animeList.slice(start, animeList.length).forEach((anime) => {
        const card = getAnimeCards()[cardIndex++];
        setAnimeCardData(card, anime);

        // Add event listener to the anime card to display the modal popup
        card.onclick = () => {
            modalWindowHandler(anime);
        };
    });
}

function setAnimeCardData(card, anime) {
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

/**
 * Appends anime cards to the anime list container.
 *
 * HTML structure of a card:
 *
 *
 *   <div class="col">
 *       <div class="card shadow-sm h-100 clickable-card">
 *           <img
 *               src=""
 *               alt=""
 *               class="card-img-top img-fluid"
 *           />
 *           <div class="card-body">
 *               <p class="card-text"></p>
 *           </div>
 *       </div>
 *   </div>
 *
 * @param {number} count - The number of anime cards to append. Default value is COUNT.
 */
function appendAnimeCardsFor(count = COUNT) {
    const animeListContainer = getAnimeListContainer();
    for (let i = 0; i < count; i++) {
        const parentContainer = document.createElement("div");
        parentContainer.classList.add("col");

        parentContainer.innerHTML = `
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
        animeListContainer.appendChild(parentContainer);
    }
}

/**
 * Removes anime cards from the start index to the end of the list.
 *
 * @param {number} start - The index to start removing anime cards from.
 */
function removeAnimeCardsFrom(start) {
    // By storing the result of getAnimeCards() in a separate variable animeCards before looping over it and removing elements,
    // you ensure that the NodeList object returned by getAnimeCards() is not modified during the loop.

    const animeCards = getAnimeCards();

    Utils.debug(`remove from ${start}, to ${animeCards.length}`);

    for (let i = start; i < animeCards.length; i++) {
        animeCards[i].remove();
    }
}

/**
 * Balances the number of anime cards with the number of anime in the list.
 *
 * @param {Array} animeList - The list of anime.
 */
function balanceAnimeCardsCount(animeList) {
    Utils.debug(
        `animeList.length: ${animeList.length}, animeCards.length: ${
            getAnimeCards().length
        }`
    );

    if (animeList.length > getAnimeCards().length) {
        appendAnimeCardsFor(animeList.length - getAnimeCards().length);
    } else if (animeList.length < getAnimeCards().length) {
        removeAnimeCardsFrom(animeList.length);
    } else {
        return;
    }
}
