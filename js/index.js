import * as AnimeAlbum from "./modules/anime-album.js";
import * as AnimeApi from "./modules/anime-api.js";

const radioBtns = {
    airing: document.querySelector("#option1-airing"),
    upcoming: document.querySelector("#option2-upcoming"),
    favorite: document.querySelector("#option3-favorite"),
    bypopularity: document.querySelector("#option4-popularity"),
};

for (const key in radioBtns) {
    radioBtns[key].addEventListener("change", updateAnimeCardsOnRadioBtn);
}

export function updateAnimeCardsOnRadioBtn() {
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

// ****************************************************************************************************
// ****************************************************************************************************
// search bar
// ****************************************************************************************************
// ****************************************************************************************************

const cache = { query: "", searchResults: [] };

const searchBar = document.querySelector("#search-bar");

const searchForm = document.querySelector("#search-form");

async function displaySearchResults() {
    const query = searchBar.value.trim().toLowerCase();

    if (cache.query === query) {
        AnimeAlbum.populateAnimeCardsForArray(cache.searchResults);
        return;
    }

    const searchResults = await AnimeApi.getAnimeByName(query);
    AnimeAlbum.populateAnimeCardsForArray(searchResults);

    cache.query = query;
    cache.searchResults = searchResults;
}

let submited = false;
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector("#load-more-btn").disabled = true;
    await displaySearchResults();
    submited = true;
});

searchBar.addEventListener("input", () => {
    if (submited) {
        if (searchBar.value === "") {
            submited = false;
            AnimeAlbum.createDefault();
            updateAnimeCardsOnRadioBtn();
            document.querySelector("#load-more-btn").disabled = true;
        }
    }
});
