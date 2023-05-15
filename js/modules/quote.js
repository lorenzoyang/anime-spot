/**
 * Module for providing quote functionality
 *
 * @module Quote
 */

import * as AnimeApi from "./anime-api.js";

/**
 * The title element of the anime quote
 *
 * @type {HTMLHeadingElement}
 */
const animeQuoteTitle = document.querySelector("#anime-quote-title");

/**
 * The text element of the anime quote
 *
 * @type {HTMLParagraphElement}
 */
const animeQuoteText = document.querySelector("#anime-quote-text");

/**
 * Gets a random anime quote from the Anime API and displays it in the anime quote element
 *
 * @async
 *
 * @returns {Promise<void>} Promise that resolves when the anime quote is displayed
 */
async function displayAnimeQuote() {
  const animeQuote = await AnimeApi.getRandomAnimeQuote();
  animeQuoteText.textContent = animeQuote.quote;
  animeQuoteTitle.innerText = `${animeQuote.character} ${animeQuote.anime}`;
  animeQuoteTitle.innerHTML = `<strong>${animeQuote.character}</strong> <small>from</small> <strong>${animeQuote.anime}</strong>`;
}

// Export the variables and functions for use in other modules.
export { displayAnimeQuote };
