/**
 * Module for providing functionality for displaying modal windows
 *
 * @module ModalWindow
 */

// anime title
const modalTitle = document.querySelector("#modal-title");

// anime image
const modalImage = document.querySelector("#modal-image");

// anime type
const modalType = document.querySelector("#modal-type");

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

// modal window object
const modal = new bootstrap.Modal(document.querySelector("#anime-modal"), {
    keyboard: true,
    focus: true,
});

/**
 * Displays the anime modal with information about the anime
 *
 * @param {Object} anime - The anime object containing information to display
 */
function animeModalContentCallback(anime) {
    // anime title
    modalTitle.textContent = anime.title;

    // anime image
    modalImage.src = anime.images.jpg.large_image_url;
    modalImage.alt = anime.title;

    // anime type
    modalType.textContent = anime.type;

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

    // ==================================================================

    // to clear the genres list after the modal is closed
    modal._element.addEventListener("hidden.bs.modal", () => {
        const modalGenres = document.querySelector("#modal-genres");
        modalGenres.innerHTML = "";
    });

    modal.show();
}

// Export the variables and functions for use in other modules.
export { animeModalContentCallback };
