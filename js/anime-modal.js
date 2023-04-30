import * as AnimeAlbum from "./modules/anime-album.js";

AnimeAlbum.setModalWindowHandler(displayAnimeModal);

function displayAnimeModal(anime) {
    const modalTitle = document.querySelector("#modal-title");
    const modalImage = document.querySelector("#modal-image");
    const modalDetails = document.querySelector("#modal-details");

    modalTitle.textContent = anime.title;

    modalImage.src = anime.images.jpg.image_url;
    modalImage.alt = anime.title;

    modalDetails.textContent = anime.synopsis;

    const modal = new bootstrap.Modal(document.getElementById("anime-modal"), {
        keyboard: true,
        focus: true,
    });

    modal.show();
}
