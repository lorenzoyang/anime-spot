/**
 * Module for providing functionality for displaying modal windows
 *
 * @module ModalWindow
 */

/**
 * Displays the anime modal with information about the anime
 *
 * @param {Object} anime - The anime object containing information to display
 */
function animeModalContentCallback(anime) {
    // title
    const modalTitle = document.querySelector("#modal-title");
    modalTitle.textContent = anime.title;

    // image
    const modalImage = document.querySelector("#modal-image");
    modalImage.src = anime.images.jpg.image_url;
    modalImage.alt = anime.title;

    // synopsis
    const modalSynopsis = document.querySelector("#modal-synopsis");
    modalSynopsis.textContent = anime.synopsis;

    // genres
    const modalGenres = document.querySelector("#modal-genres");
    anime.genres
        .map((genre) => genre.name)
        .forEach((genre) => {
            const newGenre = document.createElement("li");
            newGenre.textContent = genre;
            modalGenres.appendChild(newGenre);
        });

    // rank
    const modalRank = document.querySelector("#modal-rank");
    modalRank.textContent = anime.rank;

    // score
    const modalScore = document.querySelector("#modal-score");
    modalScore.textContent = anime.score;

    // rating
    const modalRating = document.querySelector("#modal-rating");
    modalRating.textContent = anime.rating;

    const modal = new bootstrap.Modal(document.querySelector("#anime-modal"), {
        keyboard: true,
        focus: true,
    });

    modal._element.addEventListener("hidden.bs.modal", () => {
        const modalGenres = document.querySelector("#modal-genres");
        modalGenres.innerHTML = "";
    });

    modal.show();
}

// Export the variables and functions for use in other modules.
export { animeModalContentCallback };