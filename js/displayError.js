import { errorMsg } from "./htmlElements.js"

/**
 * Displays an error message on the page
 * @param {String} errorMessage 
 */
export const displayError = (errorMessage) => {
  if (errorMessage) console.warn(errorMessage)

  errorMsg.textContent = errorMessage
}