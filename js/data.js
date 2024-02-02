import { displayError } from "./displayError.js"

const pokedexUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"

/**
 * Makes an API request to the given url and returns an object containing the data
 * @param {String} url 
 * @returns 
 */
export async function getData(url = pokedexUrl) {
  const response = await fetch(url)
  if (response.ok !== true) { //if (response.status !== 200) {
    displayError(`noe gikk galt. Status: ${response.status}`)
    return 
  }
  // clear the error message:
  displayError()

  const data = await response.json() // response.text()

  return data
}