import * as AnimeApi from "./modules/anime-api.js";

// contenitore delle anime card
const animeListContainer = document.querySelector("#anime-list-container");

const airing = { animeList: [], page: 1, hasNextPage: true };
const upcoming = { animeList: [], page: 1, hasNextPage: true };
const favorite = { animeList: [], page: 1, hasNextPage: true };
const bypopularity = { animeList: [], page: 1, hasNextPage: true };

const radioBtns = {
    airing: document.querySelector("#option1-airing"),
    upcoming: document.querySelector("#option2-upcoming"),
    favorite: document.querySelector("#option3-favorite"),
    bypopularity: document.querySelector("#option4-popularity"),
};

for (const key in radioBtns) {
    radioBtns[key].addEventListener("change", updateAnimeCards);
}

// ------------------------------------------------------------------------

async function updateAnimeCards() {
    let result;
    switch (true) {
        case radioBtns.airing.checked:
            if (airing.animeList.length === 0) {
                result = await AnimeApi.getTopAnimes(airing.page, "airing");
                airing.animeList = result.data;
                airing.page++;
                airing.hasNextPage = result.hasNextPage;
            }
            clearAnimeCards(airing.animeList.length);
            populateAnimeCards(airing.animeList);
            break;
        case radioBtns.upcoming.checked:
            if (upcoming.animeList.length === 0) {
                result = await AnimeApi.getTopAnimes(upcoming.page, "upcoming");
                upcoming.animeList = result.data;
                upcoming.page++;
                upcoming.hasNextPage = result.hasNextPage;
                console.log(
                    `upcoming.animeList.length: ${upcoming.animeList.length}`
                );
            }
            clearAnimeCards(upcoming.animeList.length);
            populateAnimeCards(upcoming.animeList);
            break;
        case radioBtns.favorite.checked:
            if (favorite.animeList.length === 0) {
                result = await AnimeApi.getTopAnimes(favorite.page, "favorite");
                favorite.animeList = result.data;
                favorite.page++;
                favorite.hasNextPage = result.hasNextPage;
            }
            clearAnimeCards(favorite.animeList.length);
            populateAnimeCards(favorite.animeList);
            break;
        case radioBtns.bypopularity.checked:
            if (bypopularity.animeList.length === 0) {
                result = await AnimeApi.getTopAnimes(
                    bypopularity.page,
                    "bypopularity"
                );
                bypopularity.animeList = result.data;
                bypopularity.page++;
                bypopularity.hasNextPage = result.hasNextPage;
            }
            clearAnimeCards(bypopularity.animeList.length);
            populateAnimeCards(bypopularity.animeList);
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
}

async function initializeAnimeCards(cardCount = AnimeApi.MAX_LIMIT) {
    for (let i = 0; i < cardCount; i++) {
        appendAnimeCard();
    }
    updateAnimeCards();
}

function populateAnimeCards(animeList, start = 0) {
    const end = animeList.length;

    const MAX_TITLE_LENGTH = 18;

    const animeCards = animeListContainer.querySelectorAll(".card");

    let cardIndex = start;
    animeList.slice(start, end).forEach((anime) => {
        const card = animeCards[cardIndex++];
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

function clearAnimeCards(start) {
    const cards = animeListContainer.querySelectorAll(".col");
    for (let i = start; i < cards.length; i++) {
        cards[i].remove();
    }
}

let requestCount = 0;
async function expandAnimeCard(cardCount = AnimeApi.MAX_LIMIT) {
    // for (let i = 0; i < cardCount; i++) {
    //     appendAnimeCard();
    // }

    console.log("called expandAnimeCard");
    if (requestCount === 3) {
        requestCount = 0;
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
    requestCount++;

    let result;
    switch (true) {
        case radioBtns.airing.checked:
            console.log("airing");
            if (airing.hasNextPage) {
                result = await AnimeApi.getTopAnimes(airing.page, "airing");
                airing.animeList = airing.animeList.concat(result.data);
                airing.page++;
                airing.hasNextPage = result.hasNextPage;

                for (let i = 0; i < cardCount; i++) {
                    appendAnimeCard();
                }

                populateAnimeCards(
                    airing.animeList,
                    airing.animeList.length - cardCount,
                    airing.animeList.length
                );
            }
            break;
        case radioBtns.upcoming.checked:
            console.log("upcoming");
            if (upcoming.hasNextPage) {
                result = await AnimeApi.getTopAnimes(upcoming.page, "upcoming");
                upcoming.animeList = upcoming.animeList.concat(result.data);
                upcoming.page++;
                upcoming.hasNextPage = result.hasNextPage;

                console.log(
                    `page: ${upcoming.page},upcoming hasNextPage: ${upcoming.hasNextPage}`
                );

                console.log(`cardCount: ${cardCount}`);

                for (let i = 0; i < cardCount; i++) {
                    appendAnimeCard();
                }

                populateAnimeCards(
                    upcoming.animeList,
                    upcoming.animeList.length - cardCount,
                    upcoming.animeList.length
                );
            }
            break;
        case radioBtns.favorite.checked:
            if (favorite.hasNextPage) {
                result = await AnimeApi.getTopAnimes(favorite.page, "favorite");
                favorite.animeList = favorite.animeList.concat(result.data);
                favorite.page++;
                favorite.hasNextPage = result.hasNextPage;

                for (let i = 0; i < cardCount; i++) {
                    appendAnimeCard();
                }

                populateAnimeCards(
                    favorite.animeList,
                    favorite.animeList.length - cardCount,
                    favorite.animeList.length
                );
            }
            break;
        case radioBtns.bypopularity.checked:
            if (bypopularity.hasNextPage) {
                result = await AnimeApi.getTopAnimes(
                    bypopularity.page,
                    "bypopularity"
                );
                bypopularity.animeList = bypopularity.animeList.concat(
                    result.data
                );
                bypopularity.page++;
                bypopularity.hasNextPage = result.hasNextPage;

                for (let i = 0; i < cardCount; i++) {
                    appendAnimeCard();
                }

                populateAnimeCards(
                    bypopularity.animeList,
                    bypopularity.animeList.length - cardCount,
                    bypopularity.animeList.length
                );
            }
            break;
        default:
            throw new Error("Invalid radio button selection");
    }
}

window.addEventListener("load", initializeAnimeCards());

let isExpanding = false;
window.addEventListener("scroll", async () => {
    if (
        !isExpanding &&
        window.scrollY + window.innerHeight >= document.body.offsetHeight
    ) {
        isExpanding = true;
        await expandAnimeCard();
        isExpanding = false;
    }
});

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
    return animeListContainer.appendChild(parentContainer);
}
