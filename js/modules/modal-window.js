/**
 * Module for providing functionality for displaying modal windows
 *
 * @module ModalWindow
 */

import * as AnimeApi from "./anime-api.js";

// anime title
const modalTitle = document.querySelector("#modal-title");

// anime image
const modalImage = document.querySelector("#modal-image");

// anime type
const modalType = document.querySelector("#modal-type");

// anime status
const modalStatus = document.querySelector("#modal-status");

// anime genres
const modalGenres = document.querySelector("#modal-genres");

// anime rank
const modalRank = document.querySelector("#modal-rank");

// anime score
const modalScore = document.querySelector("#modal-score");

// anime rating
const modalRating = document.querySelector("#modal-rating");

// anime synopsis
const modalSynopsis = document.querySelector("#modal-synopsis");

// anime watch links
const modalWatchLinks = document.querySelector("#modal-watch-links");

// modal window object
const modal = new bootstrap.Modal(document.querySelector("#anime-modal"), {
  keyboard: true,
  focus: true,
});

/**
 * Displays the anime modal with information about the anime
 *
 * @async
 *
 * @param {Object} anime - The anime object containing information to display
 */
async function animeModalContentCallback(anime) {
  if (!anime) {
    return;
  }

  // anime title
  modalTitle.textContent = anime.title;

  // anime image
  modalImage.src = anime.images.jpg.large_image_url;
  modalImage.alt = anime.title;

  // anime type
  modalType.textContent = anime.type;

  // anime status
  modalStatus.textContent = anime.status;

  // anime genres
  anime.genres
    .map((genre) => genre.name)
    .forEach((genre) => {
      const newGenre = document.createElement("li");
      newGenre.textContent = genre;
      modalGenres.appendChild(newGenre);
    });

  // anime rank
  modalRank.textContent = anime.rank;

  // anime score
  modalScore.textContent = anime.score;

  // anime rating
  modalRating.textContent = anime.rating;

  // anime synopsis
  modalSynopsis.textContent = anime.synopsis;

  // anime watch links
  const fullAnime = await AnimeApi.getAnimeById(anime.mal_id, true);
  fullAnime.streaming.forEach((watchLink) => {
    const listItem = document.createElement("li");
    const anchor = document.createElement("a");

    anchor.href = watchLink.url;
    anchor.textContent = watchLink.name;

    listItem.appendChild(anchor);
    modalWatchLinks.appendChild(listItem);
  });

  // ==================================================================

  // to clear the genres list after the modal is closed
  modal._element.addEventListener("hidden.bs.modal", () => {
    // to clear the genres list
    modalGenres.innerHTML = "";
    // to clear the watch links list
    modalWatchLinks.innerHTML = "";
  });

  modal.show();
}

// Export the variables and functions for use in other modules.
export { animeModalContentCallback };
