/** Shared loading and error feedback for the homepage. */

const errorAlert = document.querySelector("#error-alert");
const retryButton = document.querySelector("#retry-btn");
const loadingSpinner = document.querySelector("#loading-spinner");

/**
 * Displays an error and connects the retry button to the failed action.
 *
 * @param {Function} onRetry - Action to repeat
 */
function showError(onRetry) {
  errorAlert.classList.remove("d-none");

  retryButton.onclick = () => {
    hideError();
    onRetry();
  };
}

/** Hides the current error and removes its old retry handler. */
function hideError() {
  errorAlert.classList.add("d-none");
  retryButton.onclick = null;
}

/** Shows or hides the main loading indicator. */
function setLoading(isLoading) {
  loadingSpinner.style.display = isLoading ? "flex" : "none";
}

export { hideError, setLoading, showError };
