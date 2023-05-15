/**
 * Module that contains functions for displaying anime cards
 *
 * @module AnimeContainer
 */

import { MAX_LIMIT } from "./anime-api.js";
import * as Utils from "./utils.js";

/**
 * Displays anime cards based on the provided anime list starting from the given index.
 *
 * @param {Array} animeList - List of anime objects to be displayed
 * @param {number} from - Starting index of the animeList to be displayed, default is 0
 *
 * @throws Will throw an error if animeCardTemplate is not set
 * @throws Will throw an error if animeCardContentCallback is not set
 * @throws Will throw an error if animeModalContentCallback is not set
 */
function displayAnimeCards(animeList, from = 0) {
  if (!animeCardTemplate) {
    throw new Error("Anime card template not set");
  }

  if (!animeCardContentCallback) {
    throw new Error("Display anime card callback not set");
  }

  if (!animeModalContentCallback) {
    throw new Error("Display anime modal callback not set");
  }

  if (animeList.length === 0) {
    for (let i = 0; i < MAX_LIMIT; i++) {
      animeList.push(null);
    }
  }

  resizeAnimeCards(animeList);

  Utils.debug(`from: ${from}, animeList.length: ${animeList.length}`);

  let cardIndex = from;
  animeList.slice(from, animeList.length).forEach((anime) => {
    const card = getAnimeCards()[cardIndex++];
    animeCardContentCallback(card, anime);

    // Add event listener to the anime card to display the modal popup
    card.onclick = () => {
      animeModalContentCallback(anime);
    };
  });
}

/**
 * HTML template for anime card
 *
 * @type {string}
 */
let animeCardTemplate;

/**
 * Sets the HTML template for anime card.
 *
 * @param {string} template - HTML template for anime card
 */
function setAnimeCardTemplate(template) {
  animeCardTemplate = template;
}

/**
 * Callback function for displaying anime card content.
 *
 * @callback animeCardContentCallback
 *
 * @param {HTMLElement} card - The HTML element of the anime card
 * @param {Object} anime - The anime object to be displayed on the card
 */
let animeCardContentCallback;

/**
 * Sets the callback function for displaying anime card content.
 *
 * @param {animeCardContentCallback} callback - The callback function for displaying anime card content
 */
function setAnimeCardContentCallback(callback) {
  animeCardContentCallback = callback;
}

/**
 * Callback function for displaying anime modal content.
 *
 * @callback animeModalContentCallback
 *
 * @async
 *
 * @param {Object} anime - The anime object to be displayed in the modal
 */
let animeModalContentCallback;

/**
 * Sets the callback function for displaying anime modal content.
 *
 * @param {animeModalContentCallback} callback - The callback function for displaying anime modal content
 */
function setAnimeModalContentCallback(callback) {
  animeModalContentCallback = callback;
}

// * ====================================================================================================
// * private functions
// * ====================================================================================================

/**
 * Get the anime list container element.
 *
 * @returns {Element} The anime list container element.
 */
function getAnimeContainer() {
  return document.querySelector("#anime-list-container");
}

/**
 * Get all anime card elements within the anime list container.
 *
 * @returns {NodeList} A NodeList of all anime card elements.
 */
function getAnimeCards() {
  return getAnimeContainer().querySelectorAll(".col");
}

/**
 * Appends anime cards to the anime container for the specified count.
 *
 * @param {number} count - The number of anime cards to append
 */
function appendAnimeCardsFor(count) {
  const animeContainer = getAnimeContainer();

  for (let i = 0; i < count; i++) {
    const parentContainer = document.createElement("div");
    parentContainer.classList.add("col");

    parentContainer.innerHTML = animeCardTemplate;

    animeContainer.appendChild(parentContainer);
  }
}

/**
 * Removes anime cards starting from the specified index.
 *
 * @param {number} index - The index of the first anime card to remove
 */
function removeAnimeCardsFrom(index) {
  const animeCards = getAnimeCards();

  for (let i = index; i < animeCards.length; i++) {
    animeCards[i].remove();
  }
}

/**
 * Resizes the anime cards to match the length of the anime list.
 *
 * @param {Array<Object>} animeList - The list of anime to resize the cards for
 */
function resizeAnimeCards(animeList) {
  const listCount = animeList.length;
  const cardCount = getAnimeCards().length;

  Utils.debug(`before: listCount: ${listCount}, cardCount: ${cardCount}`);

  if (listCount > cardCount) {
    appendAnimeCardsFor(listCount - cardCount);
  } else if (listCount < cardCount) {
    removeAnimeCardsFrom(listCount);
  }

  Utils.debug(
    `after: listCount: ${animeList.length}, cardCount: ${
      getAnimeCards().length
    }`
  );
}

// Export the variables and functions for use in other modules.
export {
  displayAnimeCards,
  setAnimeCardTemplate,
  setAnimeCardContentCallback,
  setAnimeModalContentCallback,
};
