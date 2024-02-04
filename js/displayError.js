import { errorMsg } from "./htmlElements.js"

/**
 * @param {String} errorMessage 
 */
export const displayError = (errorMessage) => {
  if (errorMessage) console.warn(errorMessage)

  errorMsg.textContent = errorMessage
}