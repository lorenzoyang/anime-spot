import * as AnimeAlbum from "./modules/anime-album.js";

const radioBtns = {
    airing: document.querySelector("#option1-airing"),
    upcoming: document.querySelector("#option2-upcoming"),
    favorite: document.querySelector("#option3-favorite"),
    bypopularity: document.querySelector("#option4-popularity"),
};

for (const key in radioBtns) {
    radioBtns[key].addEventListener("change", updateAnimeCardsOnRadioBtn);
}

function updateAnimeCardsOnRadioBtn() {
    switch (true) {
        case radioBtns.airing.checked:
            AnimeAlbum.populateAnimeCards("airing");
            break;
        case radioBtns.upcoming.checked:
            AnimeAlbum.populateAnimeCards("upcoming");
            break;
        case radioBtns.favorite.checked:
            AnimeAlbum.populateAnimeCards("favorite");
            break;
        case radioBtns.bypopularity.checked:
            AnimeAlbum.populateAnimeCards("bypopularity");
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
}

function expandAnimeCardsOnRadioBtn() {
    switch (true) {
        case radioBtns.airing.checked:
            AnimeAlbum.expandAnimeCards("airing");
            break;
        case radioBtns.upcoming.checked:
            AnimeAlbum.expandAnimeCards("upcoming");
            break;
        case radioBtns.favorite.checked:
            AnimeAlbum.expandAnimeCards("favorite");
            break;
        case radioBtns.bypopularity.checked:
            AnimeAlbum.expandAnimeCards("bypopularity");
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
}

window.addEventListener("load", AnimeAlbum.initializeAnimeAlbum());

let isFunctionRunning = false;
let isThrottled = false;
window.addEventListener("scroll", () => {
    if (isFunctionRunning || isThrottled) {
        return;
    }

    if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
        isFunctionRunning = true;
        expandAnimeCardsOnRadioBtn();
        setTimeout(() => {
            isFunctionRunning = false;
            isThrottled = false;
        }, 1000); // set a timeout to reset the flag variable after a delay
        isThrottled = true;
    }
});
