import * as AnimeApi from "./modules/anime-api.js";
import * as AnimeAlbum from "./modules/anime-album.js";
import * as Index from "./index.js";

// per ottenere il valore di input del form di ricerca
const searchBar = document.querySelector("#search-bar");
// per preventivare il comportamento di default del form di ricerca
const searchForm = document.querySelector("#search-form");

const cache = { query: "", searchResults: [] };

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
            // TODO can be improved to avoid to import Index
            Index.updateAnimeCardsOnRadioBtn();
            document.querySelector("#load-more-btn").disabled = true;
        }
    }
});
