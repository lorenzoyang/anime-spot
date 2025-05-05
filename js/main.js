import * as AnimeContainer from "./modules/anime-container.js";
import * as Homepage from "./modules/homepage.js";
import * as ModalWindow from "./modules/modal-window.js";
import * as SearchBar from "./modules/search-bar.js";

// * ====================================================================================================
// * Set up the AnimeContainer with these templates and callbacks.
// * ====================================================================================================

// Set the AnimeCard template to use the one from the Homepage.
AnimeContainer.setAnimeCardTemplate(Homepage.ANIME_CARD_TEMPLATE);

// Set the content callback for the AnimeCard to use the one from the Homepage.
AnimeContainer.setAnimeCardContentCallback(Homepage.animeCardContentCallback);

// Set the content callback for the AnimeModal to use the one from the ModalWindow.
AnimeContainer.setAnimeModalContentCallback(
  ModalWindow.animeModalContentCallback
);

// * ====================================================================================================
// * Set up event listeners for the Homepage.
// * ====================================================================================================

// Initialize the predefined anime cards on page load.
window.addEventListener("load", Homepage.initHomepage);

// Update anime cards when radio buttons are selected.
for (const key in Homepage.radioBtns) {
  Homepage.radioBtns[key].addEventListener(
    "change",
    Homepage.updateAnimeCardsOnRadioBtn
  );
}

// Expand anime cards when "Load More" button is clicked.
document
  .querySelector("#load-more-btn")
  .addEventListener("click", Homepage.expandAnimeCardsOnRadioBtn);

// * ====================================================================================================
// * Set up event listeners for the search bar and search form on the homepage.
// * ====================================================================================================

const searchBar = document.querySelector("#search-bar");
const searchForm = document.querySelector("#search-form");

const loadMoreBtn = document.querySelector("#load-more-btn");

let submited = false;

// When the search form is submitted, display anime cards based on the search query.
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loadMoreBtn.disabled = true;

  AnimeContainer.displayAnimeCards(
    await SearchBar.getAnimeSearchResults(searchBar)
  );

  submited = true;
});

// When the search bar input changes, reset the anime cards on the homepage if the search form has been submitted and the search bar is empty.
searchBar.addEventListener("input", () => {
  if (submited) {
    if (searchBar.value === "") {
      submited = false;
      loadMoreBtn.disabled = false;
      Homepage.updateAnimeCardsOnRadioBtn();
    }
  }
});
