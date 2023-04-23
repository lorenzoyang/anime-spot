import * as AnimeApi from "./modules/anime-api.js";

const radioBtns = {
    airing: document.querySelector("#option1-airing"),
    upcoming: document.querySelector("#option2-upcoming"),
    favorite: document.querySelector("#option3-favorite"),
    bypopularity: document.querySelector("#option4-popularity"),
};

for (const key in radioBtns) {
    radioBtns[key].addEventListener("change", updateAnimeCards);
}

const airing = { animeList: [], page: 1 };
const upcoming = { animeList: [], page: 1 };
const favorite = { animeList: [], page: 1 };
const bypopularity = { animeList: [], page: 1 };

async function updateAnimeCards() {
    switch (true) {
        case radioBtns.airing.checked:
            if (airing.animeList.length === 0) {
                airing.animeList = await AnimeApi.getTopAnimes("airing");
                airing.page++;
            }
            populateAnimeCards(airing.animeList);
            break;
        case radioBtns.upcoming.checked:
            if (upcoming.animeList.length === 0) {
                upcoming.animeList = await AnimeApi.getTopAnimes("upcoming");
                upcoming.page++;
            }
            populateAnimeCards(upcoming.animeList);
            break;
        case radioBtns.favorite.checked:
            if (favorite.animeList.length === 0) {
                favorite.animeList = await AnimeApi.getTopAnimes("favorite");
                favorite.page++;
            }
            populateAnimeCards(favorite.animeList);
            break;
        case radioBtns.bypopularity.checked:
            if (bypopularity.animeList.length === 0) {
                bypopularity.animeList = await AnimeApi.getTopAnimes(
                    "bypopularity"
                );
                bypopularity.page++;
            }
            populateAnimeCards(bypopularity.animeList);
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
}

function initializeAnimeCards(cardCount) {
    for (let i = 0; i < cardCount; i++) {
        appendAnimeCard();
    }
    updateAnimeCards();
}

function populateAnimeCards(animeList) {
    const MAX_TITLE_LENGTH = 18;

    const animeCards = animeListContainer.querySelectorAll(".card");
    animeList.forEach((anime, index) => {
        const card = animeCards[index];
        const img = card.querySelector("img");
        const title = card.querySelector(".card-text");

        img.src = anime.images.jpg.large_image_url;
        img.alt = anime.title;

        anime.title =
            anime.title.length > MAX_TITLE_LENGTH
                ? anime.title.substring(0, MAX_TITLE_LENGTH) + "..."
                : anime.title;
        title.innerHTML = `<strong>${anime.title}</strong>`;
    });
}

window.addEventListener("load", AnimeApi.getTopAnimes("airing"));

// window.addEventListener("load", generateAnimeImageCards(AnimeApi.MAX_COUNT));
// window.addEventListener("load", loadAnimeImagesByRadioSelection);
// window.addEventListener("load", AnimeApi.getAnimeByName("naruto"));

//

// contenitore delle anime card
const animeListContainer = document.querySelector("#anime-list-container");

function generateAnimeCards(cardCount) {
    for (let i = 0; i < cardCount; i++) {
        appendAnimeCard();
    }
}

function appendAnimeCard() {
    // HTML TEMPLATE
    // <div class="col">
    //     <div class="card shadow-sm h-100">
    //         <img src="" alt="" class="card-img-top" />
    //         <div class="card-body">
    //             <p class="card-text"></p>
    //         </div>
    //     </div>
    // </div>
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
