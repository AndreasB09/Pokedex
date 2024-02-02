import { displayError } from "./displayError.js"

const pokedexUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"

/**
 * @param {String} url 
 * @returns 
 */
export async function getData(url = pokedexUrl) {
  const response = await fetch(url)
  if (response.ok !== true) {
    displayError(`Something went wrong. Status: ${response.status}`)
    return 
  }
  
  displayError()

  const data = await response.json()

  return data
}