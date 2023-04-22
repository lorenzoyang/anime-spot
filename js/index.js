import * as AnimeApi from "./modules/anime-api.js";

const radioBtns = {
    airing: document.querySelector("#option1-airing"),
    upcoming: document.querySelector("#option2-upcoming"),
    favorite: document.querySelector("#option3-favorite"),
    bypopularity: document.querySelector("#option4-popularity"),
};

for (const key in radioBtns) {
    radioBtns[key].addEventListener("change", loadAnimesImages);
}

let airingAnimeList = [];
let upcomingAnimeList = [];
let favoriteAnimeList = [];
let bypopularityAnimeList = [];

async function loadAnimesImages() {
    if (radioBtns.airing.checked) {
        if (airingAnimeList.length === 0) {
            airingAnimeList = await AnimeApi.getTopAnimes({ filter: "airing" });
            fillAnimeImages(airingAnimeList);
        } else {
            fillAnimeImages(airingAnimeList);
        }
    } else if (radioBtns.upcoming.checked) {
        if (upcomingAnimeList.length === 0) {
            upcomingAnimeList = await AnimeApi.getTopAnimes({
                filter: "upcoming",
            });
            fillAnimeImages(upcomingAnimeList);
        } else {
            fillAnimeImages(upcomingAnimeList);
        }
    } else if (radioBtns.favorite.checked) {
        if (favoriteAnimeList.length === 0) {
            favoriteAnimeList = await AnimeApi.getTopAnimes({
                filter: "favorite",
            });
            fillAnimeImages(favoriteAnimeList);
        } else {
            fillAnimeImages(favoriteAnimeList);
        }
    } else {
        if (bypopularityAnimeList.length === 0) {
            bypopularityAnimeList = await AnimeApi.getTopAnimes({
                filter: "bypopularity",
            });
            fillAnimeImages(bypopularityAnimeList);
        } else {
            fillAnimeImages(bypopularityAnimeList);
        }
    }
}

function createAnimeImageTemplate(quantity) {
    const animeListContainer = document.querySelector("#anime-list-container");

    for (let i = 0; i < quantity; i++) {
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

function fillAnimeImages(animeList) {
    const animeListContainer = document.querySelector("#anime-list-container");
    const animeCards = animeListContainer.querySelectorAll(".card");

    animeCards.forEach((card, index) => {
        const anime = animeList[index];
        const img = card.querySelector("img");
        const title = card.querySelector(".card-text");

        img.src = anime.images.jpg.small_image_url;
        img.alt = anime.title;

        title.textContent = anime.title;
    });
}

window.addEventListener("load", createAnimeImageTemplate(AnimeApi.maxQuantity));
window.addEventListener("load", loadAnimesImages);
