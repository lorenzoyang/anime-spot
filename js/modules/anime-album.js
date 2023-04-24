import * as AnimeApi from "./anime-api.js";

const COUNT = AnimeApi.MAX_LIMIT;

const airing = { animeList: [], page: 1, hasNextPage: true };
const upcoming = { animeList: [], page: 1, hasNextPage: true };
const favorite = { animeList: [], page: 1, hasNextPage: true };
const bypopularity = { animeList: [], page: 1, hasNextPage: true };

const animeFilter = {
    airing: airing,
    upcoming: upcoming,
    favorite: favorite,
    bypopularity: bypopularity,
};

export function createDefault() {
    removeAnimeCardsFrom(0);
    appendAnimeCardsFor(COUNT);
}

export async function populateAnimeCardsForFilter(filter) {
    if (animeFilter[filter].animeList.length === 0) {
        const result = await AnimeApi.getTopAnimes(
            animeFilter[filter].page,
            filter
        );
        animeFilter[filter].animeList = result.data;
        animeFilter[filter].page++;
        animeFilter[filter].hasNextPage = result.hasNextPage;
    }
    populateAnimeCards(animeFilter[filter].animeList);
}

export function populateAnimeCardsForArray(animeList) {
    populateAnimeCards(animeList);
}

export async function expandAnimeCardsForFilter(filter) {
    if (animeFilter[filter].hasNextPage) {
        // appendAnimeCardsFor(COUNT);

        let result = await AnimeApi.getTopAnimes(
            animeFilter[filter].page,
            filter
        );

        animeFilter[filter].animeList = animeFilter[filter].animeList.concat(
            result.data
        );
        animeFilter[filter].page++;
        animeFilter[filter].hasNextPage = result.hasNextPage;

        populateAnimeCards(
            animeFilter[filter].animeList,
            animeFilter[filter].animeList.length - COUNT
        );
    }
}

// ****************************************************************************************************
// ****************************************************************************************************
// helper functions
// ****************************************************************************************************
// ****************************************************************************************************

function getAnimeListContainer() {
    // contenitore delle anime card
    return document.querySelector("#anime-list-container");
}

function getAnimeCards() {
    return getAnimeListContainer().querySelectorAll(".col");
}

function populateAnimeCards(animeList, start = 0) {
    balanceAnimeCardsCount(animeList);

    if (getAnimeCards().length !== animeList.length) {
        console.log(
            `animeList.length: ${animeList.length} <-> animeCards.length: ${
                getAnimeCards().length
            }`
        );

        throw new Error("Error: animeCards.length !== animeList.length");
    }

    const MAX_TITLE_LENGTH = 18;

    let cardIndex = start;

    console.log(
        `cardIndex/start: ${cardIndex}, animeList.length: ${
            animeList.length
        }, animeCards.length: ${getAnimeCards().length}`
    );

    animeList.slice(start, animeList.length).forEach((anime) => {
        const card = getAnimeCards()[cardIndex++];
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

function appendAnimeCardsFor(count = COUNT) {
    // HTML TEMPLATE
    // <div class="col">
    //     <div class="card shadow-sm h-100">
    //         <img src="" alt="" class="card-img-top" />
    //         <div class="card-body">
    //             <p class="card-text"></p>
    //         </div>
    //     </div>
    // </div>
    for (let i = 0; i < count; i++) {
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
        getAnimeListContainer().appendChild(parentContainer);
    }
}

function removeAnimeCardsFrom(start) {
    console.log(`remove from ${start} to ${getAnimeCards().length}`);

    // By storing the result of getAnimeCards() in a separate variable animeCards before looping over it and removing elements,
    // you ensure that the NodeList object returned by getAnimeCards() is not modified during the loop.
    const animeCards = getAnimeCards();
    for (let i = start; i < animeCards.length; i++) {
        animeCards[i].remove();
    }
}

function balanceAnimeCardsCount(animeList) {
    console.log(
        `animeList.length: ${animeList.length} <-> animeCards.length: ${
            getAnimeCards().length
        }`
    );

    if (animeList.length > getAnimeCards().length) {
        console.log("appendAnimeCardsFor called");

        appendAnimeCardsFor(animeList.length - getAnimeCards().length);
    } else if (animeList.length < getAnimeCards().length) {
        console.log("removeAnimeCardsFrom called");

        removeAnimeCardsFrom(animeList.length);
    } else {
        return;
    }
}
