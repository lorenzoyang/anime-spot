import * as AnimeContainer from "./modules/anime-container.js";
import * as AnimeApi from "./modules/anime-api.js";
import { displayAnimeModalCallback } from "./modules/anime-modal.js";

// Radio button object containing all radio buttons in the HTML
const radioBtns = {
    airing: document.querySelector("#option1-airing"),
    upcoming: document.querySelector("#option2-upcoming"),
    favorite: document.querySelector("#option3-favorite"),
    bypopularity: document.querySelector("#option4-popularity"),
};

// anime list cahce object
const animeCache = {
    airing: { animeList: [], page: 1, hasNextPage: true },
    upcoming: { animeList: [], page: 1, hasNextPage: true },
    favorite: { animeList: [], page: 1, hasNextPage: true },
    bypopularity: { animeList: [], page: 1, hasNextPage: true },

    searchResult: { animeList: [] },
};

// ******************************************************
// * setup of anime container module
// ******************************************************

// setup AnimeCardTempolate
AnimeContainer.setAnimeCardTemplate(`
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
`);

// setup displayAnimeCardCallback
AnimeContainer.setDisplayAnimeCardCallback((card, anime) => {
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
});

// setup displayAnimeModalCallback
AnimeContainer.setDisplayAnimeModalCallback(displayAnimeModalCallback);

// ******************************************************
// * helper functions
// ******************************************************

// function for lazy load anime list
async function lazyLoadAnimeList(filter) {
    if (animeCache[filter].animeList.length === 0) {
        const result = await AnimeApi.getTopAnimes(
            animeCache[filter].page,
            filter
        );
        animeCache[filter].animeList = result.data;
        animeCache[filter].page++;
        animeCache[filter].hasNextPage = result.hasNextPage;
    }
}

// Update anime cards based on the selected radio button
async function updateAnimeCardsOnRadioBtn() {
    let filter;
    switch (true) {
        case radioBtns.airing.checked:
            filter = "airing";
            break;
        case radioBtns.upcoming.checked:
            filter = "upcoming";
            break;
        case radioBtns.favorite.checked:
            filter = "favorite";
            break;
        case radioBtns.bypopularity.checked:
            filter = "bypopularity";
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
    await lazyLoadAnimeList(filter);
    AnimeContainer.displayAnimeCards(animeCache[filter].animeList);
}

// function to expand anime list
async function expandAnimeList(filter) {
    if (animeCache[filter].hasNextPage) {
        let result = await AnimeApi.getTopAnimes(
            animeCache[filter].page,
            filter
        );

        animeCache[filter].animeList = animeCache[filter].animeList.concat(
            result.data
        );
        animeCache[filter].page++;
        animeCache[filter].hasNextPage = result.hasNextPage;
    }
}

// Expand anime cards based on the selected radio button
async function expandAnimeCardsOnRadioBtn() {
    let filter;
    switch (true) {
        case radioBtns.airing.checked:
            filter = "airing";
            break;
        case radioBtns.upcoming.checked:
            filter = "upcoming";
            break;
        case radioBtns.favorite.checked:
            filter = "favorite";
            break;
        case radioBtns.bypopularity.checked:
            filter = "bypopularity";
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
    const oldLength = animeCache[filter].animeList.length;
    await expandAnimeList(filter);
    AnimeContainer.displayAnimeCards(animeCache[filter].animeList, oldLength);
}

// ******************************************************
// * setup of the entry point of the application
// ******************************************************

// setup predefined anime cards of home page
window.addEventListener("load", async () => {
    await lazyLoadAnimeList("airing");
    AnimeContainer.displayAnimeCards(animeCache.airing.animeList);
});

// Adding event listener to each radio button, to update anime cards based on radio button selection
for (const key in radioBtns) {
    radioBtns[key].addEventListener("change", updateAnimeCardsOnRadioBtn);
}

document.querySelector("#load-more-btn").addEventListener("click", () => {
    expandAnimeCardsOnRadioBtn();
});
