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
            AnimeAlbum.populateAnimeCardsForFilter("airing");
            break;
        case radioBtns.upcoming.checked:
            AnimeAlbum.populateAnimeCardsForFilter("upcoming");
            break;
        case radioBtns.favorite.checked:
            AnimeAlbum.populateAnimeCardsForFilter("favorite");
            break;
        case radioBtns.bypopularity.checked:
            AnimeAlbum.populateAnimeCardsForFilter("bypopularity");
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
}

async function expandAnimeCardsOnRadioBtn() {
    switch (true) {
        case radioBtns.airing.checked:
            await AnimeAlbum.expandAnimeCardsForFilter("airing");
            break;
        case radioBtns.upcoming.checked:
            await AnimeAlbum.expandAnimeCardsForFilter("upcoming");
            break;
        case radioBtns.favorite.checked:
            await AnimeAlbum.expandAnimeCardsForFilter("favorite");
            break;
        case radioBtns.bypopularity.checked:
            await AnimeAlbum.expandAnimeCardsForFilter("bypopularity");
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
}

window.addEventListener("load", () => {
    AnimeAlbum.createDefault();
    AnimeAlbum.populateAnimeCardsForFilter("airing");
});

document.querySelector("#load-more-btn").addEventListener("click", async () => {
    await expandAnimeCardsOnRadioBtn();
});
