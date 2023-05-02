/**
 *
 * @module AnimeContainer
 */

export function displayAnimeCards(animeList, from = 0) {
    if (!animeCardTemplate) {
        throw new Error("Anime card template not set");
    }

    if (!displayAnimeCardCallback) {
        throw new Error("Display anime card callback not set");
    }

    if (!displayAnimeModalCallback) {
        throw new Error("Display anime modal callback not set");
    }

    resizeAnimeCards(animeList);

    let cardIndex = from;
    animeList.slice(from, animeList.length).forEach((anime) => {
        const card = getAnimeCards()[cardIndex++];
        displayAnimeCardCallback(card, anime);

        // Add event listener to the anime card to display the modal popup
        card.onclick = () => {
            displayAnimeModalCallback(anime);
        };
    });
}

// anime card html template
let animeCardTemplate;

export function setAnimeCardTemplate(template) {
    animeCardTemplate = template;
}

// function(card, anime)
let displayAnimeCardCallback;

export function setDisplayAnimeCardCallback(callback) {
    displayAnimeCardCallback = callback;
}

// function(anime)
let displayAnimeModalCallback;

export function setDisplayAnimeModalCallback(callback) {
    displayAnimeModalCallback = callback;
}

// ****************************************************************************************************
// * private
// ****************************************************************************************************

/**
 * Get the anime list container element.
 *
 * @returns {Element} The anime list container element.
 */
function getAnimeContainer() {
    return document.querySelector("#anime-list-container");
}

/**
 * Get all anime card elements within the anime list container.
 *
 * @returns {NodeList} A NodeList of all anime card elements.
 */
function getAnimeCards() {
    return getAnimeContainer().querySelectorAll(".col");
}

function appendAnimeCardsFor(count) {
    const animeContainer = getAnimeContainer();
    for (let i = 0; i < count; i++) {
        const parentContainer = document.createElement("div");
        parentContainer.classList.add("col");

        parentContainer.innerHTML = animeCardTemplate;

        animeContainer.appendChild(parentContainer);
    }
}

function removeAnimeCardsFrom(index) {
    const animeCards = getAnimeCards();

    for (let i = index; i < animeCards.length; i++) {
        animeCards[i].remove();
    }
}

function resizeAnimeCards(animeList) {
    const listCount = animeList.length;
    const cardCount = getAnimeCards().length;

    if (listCount > cardCount) {
        appendAnimeCardsFor(listCount - cardCount);
    } else if (listCount < cardCount) {
        removeAnimeCardsFrom(listCount);
    } else {
        return;
    }
}
