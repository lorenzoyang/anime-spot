import * as AnimeApi from "./modules/anime-api.js";

const radioBtns = {
    airing: document.querySelector("#option1-airing"),
    upcoming: document.querySelector("#option2-upcoming"),
    favorite: document.querySelector("#option3-favorite"),
    bypopularity: document.querySelector("#option4-popularity"),
};

for (const key in radioBtns) {
    radioBtns[key].addEventListener("change", loadAnimeImagesByRadioSelection);
}

let airingAnimeList = [];
let upcomingAnimeList = [];
let favoriteAnimeList = [];
let bypopularityAnimeList = [];

async function loadAnimeImagesByRadioSelection() {
    switch (true) {
        case radioBtns.airing.checked:
            if (airingAnimeList.length === 0) {
                airingAnimeList = await AnimeApi.getTopAnimes({
                    filter: "airing",
                });
            }
            populateAnimeImageCards(airingAnimeList);
            break;
        case radioBtns.upcoming.checked:
            if (upcomingAnimeList.length === 0) {
                upcomingAnimeList = await AnimeApi.getTopAnimes({
                    filter: "upcoming",
                });
            }
            populateAnimeImageCards(upcomingAnimeList);
            break;
        case radioBtns.favorite.checked:
            if (favoriteAnimeList.length === 0) {
                favoriteAnimeList = await AnimeApi.getTopAnimes({
                    filter: "favorite",
                });
            }
            populateAnimeImageCards(favoriteAnimeList);
            break;
        case radioBtns.bypopularity.checked:
            if (bypopularityAnimeList.length === 0) {
                bypopularityAnimeList = await AnimeApi.getTopAnimes({
                    filter: "bypopularity",
                });
            }
            populateAnimeImageCards(bypopularityAnimeList);
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
}

function generateAnimeImageCards(cardCount) {
    // HTML TEMPLATE
    // <div class="col">
    //     <div class="card shadow-sm h-100">
    //         <img src="" alt="" class="card-img-top" />
    //         <div class="card-body">
    //             <p class="card-text"></p>
    //         </div>
    //     </div>
    // </div>
    const animeListContainer = document.querySelector("#anime-list-container");

    for (let i = 0; i < cardCount; i++) {
        const parentContainer = document.createElement("div");
        parentContainer.classList.add("col");

        parentContainer.innerHTML = `
        <div class="card shadow-sm h-100">
            <img src="" alt="" class="card-img-top" />
            <div class="card-body">
                <p class="card-text"></p>
            </div>
        </div>
    `;
        animeListContainer.appendChild(parentContainer);
    }
}

function populateAnimeImageCards(animeList) {
    const MAX_TITLE_LENGTH = 20;
    const animeListContainer = document.querySelector("#anime-list-container");
    const animeCards = animeListContainer.querySelectorAll(".card");

    animeCards.forEach((card, index) => {
        const anime = animeList[index];
        const img = card.querySelector("img");
        const title = card.querySelector(".card-text");

        // img.src = anime.images.jpg.small_image_url;
        img.src = anime.images.jpg.large_image_url;
        img.alt = anime.title;

        anime.title =
            anime.title.length > MAX_TITLE_LENGTH
                ? anime.title.substring(0, MAX_TITLE_LENGTH) + "..."
                : anime.title;
        title.innerHTML = `<strong>${anime.title}</strong>`;
    });
}

window.addEventListener("load", generateAnimeImageCards(AnimeApi.maxQuantity));
window.addEventListener("load", loadAnimeImagesByRadioSelection);
