import { 
  buttonStart, 
  buttonNext, 
  buttonPrev,
  buttonRandom,
  buttonSearch,
  errorMsg, 
  mainContainer, 
  searchInputEl
} from "./htmlElements.js"

import { getData } from "./data.js"


let pokemonList = []

// nav events:
buttonStart.addEventListener("click", () => {
  displayPokemonList()
})

buttonNext.addEventListener("click", () => {
  
  if (pokemonList.next) displayPokemonList(pokemonList.next)
  else displayPokemonList()
})

buttonPrev.addEventListener("click", () => {

  if (pokemonList.previous) displayPokemonList(pokemonList.previous)
  else displayPokemonList(`https://pokeapi.co/api/v2/pokemon?offset=${pokemonList.lastPage}&limit=20`)
})





/**
 * Updates pokemonList
 * @param {String} url - the url we want to get data from
 */
const updatePokemonList = async (url) => pokemonList = await getData(url)

/**
 * Updates the pokemonList.lastPage to given perPage-param
 * @param {Number} perPage - number of pokemons per page (default 20)
 * @returns 
 */
const setLastPage = (perPage = 20) => pokemonList.lastPage = Math.floor(pokemonList.count/perPage)*perPage

// displays list of pokemons based on given url
async function displayPokemonList(url) {
  await updatePokemonList(url)
  setLastPage()

  console.log(pokemonList.results)

  mainContainer.innerHTML = ""

  //pokemonList.results.forEach(async pokemon => { // array methods dont fully support async-await, hence we use a normal for-of loop instead:
  for (const pokemon of pokemonList.results) {

    // get the id and image of the pokemon:
    //console.log(pokemon.url)
    const pokemonExtraData = await getData(pokemon.url)

    const containerEl = document.createElement("div")
    const titleEl = document.createElement("h2")
    titleEl.textContent = `${pokemonExtraData.id}. ${pokemon.name}`
    const imageEl = document.createElement("img")
    imageEl.alt = `image of ${pokemon.name}`
    imageEl.style = "max-width: 40%;"
    imageEl.src = pokemonExtraData.sprites.other["official-artwork"].front_default

    containerEl.append(titleEl, imageEl)
    mainContainer.append(containerEl)

    containerEl.addEventListener("click", () => displayPokemonDetails(pokemonExtraData))
  };
}

/**
 * Creates an element of the given type, with given properties and then returns it
 * @param {String} type - default "div"
 * @param {Object} properties - "html object properties"
 * @returns Html element
 */
const makeElement = (type = "div", properties = {}) => {
  const element = document.createElement(type)

  const propsArray = Object.entries(properties)

  propsArray.forEach((property) => {
    const [key, value] = property

    element[key] = value
  })

  return element
}

async function displayPokemonDetails(pokemonData) {
  mainContainer.innerHTML = ""

  /* const name = pokemonData.name
  const height = pokemonData.height */

  const {id, name, sprites, base_experience, height, weight, types, stats} = pokemonData

  // id, name
  // base_experience
  // height (må deles på 10 for å få meter)
  // weight (må deles på 10 for å få kg)
  // types (array)
  // stats (array)

  

  const containerEl = makeElement()
  const titleEl = makeElement("h2", { textContent: `${id}. ${name}`})

  const imageEl = makeElement("img", {
    alt: `image of ${name}`,
    style: "max-width: 40%;",
    src: sprites.other["official-artwork"].front_default
  })

  const xpEl = makeElement("p", { textContent: `XP: ${base_experience}`})
  const heightEl = makeElement("p", {textContent: `Height: ${height/10} M`})
  const weightEl = makeElement("p", {textContent: `Weight: ${weight/10} Kg`})
  const typesContainer = makeElement("div")
  const typesHeaderEl = makeElement("h3", {textContent: "Types:"})
  typesContainer.append(typesHeaderEl)

  types.forEach(type => {
    const typeEl = document.createElement("p")
    typeEl.textContent = type.type.name
    typesContainer.append(typeEl)
  })

  const statsContainer = document.createElement("div")
  const statsHeaderEl = document.createElement("h3")
  statsHeaderEl.textContent = "Stats:"
  statsContainer.append(statsHeaderEl)

  stats.forEach(value => {
    const {stat, base_stat, effort} = value
    const statEl = document.createElement("p")
    statEl.textContent = 
      `${stat.name}: ${base_stat} (effort: ${effort})`

    statsContainer.append(statEl)
  })

  containerEl.append(titleEl, imageEl, xpEl, heightEl, weightEl, typesContainer, statsContainer)
  mainContainer.append(containerEl)
}

displayPokemonList()


// displays list of pokemons based on array of pokemons
async function displayFilteredPokemonList(pokemonArray) {

  mainContainer.innerHTML = ""

  //pokemonList.results.forEach(async pokemon => { // array methods dont fully support async-await, hence we use a normal for-of loop instead:
  for (const pokemon of pokemonArray) {

    // get the id and image of the pokemon:
    //console.log(pokemon.url)
    const pokemonExtraData = await getData(pokemon.url)

    const containerEl = document.createElement("div")
    const titleEl = document.createElement("h2")
    titleEl.textContent = `${pokemonExtraData.id}. ${pokemon.name}`
    const imageEl = document.createElement("img")
    imageEl.alt = `image of ${pokemon.name}`
    imageEl.style = "max-width: 40%;"
    imageEl.src = pokemonExtraData.sprites.other["official-artwork"].front_default

    containerEl.append(titleEl, imageEl)
    mainContainer.append(containerEl)

    containerEl.addEventListener("click", () => displayPokemonDetails(pokemonExtraData))
  };
}

buttonSearch.addEventListener("click", async () => {
  const searchText = searchInputEl.value.toLowerCase()
  // check if input is valid
  if (searchText.length < 3) {
    displayError("Please enter 3 or more characters")
    return
  }
  // clear error message:
  displayError()
  
  // x 1. get the list of all pokemons in the API-database (this can be done by setting the limit to -1 or a number equal or larger to the total amount of pokemons in the database)
  const pokemonResult = await getData("https://pokeapi.co/api/v2/pokemon?offset=0&limit=-1")
  const pokemonArray = pokemonResult.results
  // 2. filter the results based on the search-query
  const filteredPokemons = pokemonArray.filter((pokemon) => {
    if (pokemon.name.includes(searchText)) {
      return true
    }
  
  })
  
  // check if any matched are found, if none display an error to the user:
  if (!filteredPokemons.length) {
    displayError("No pokemons found")
    return
  } 
  // x 3. diplay the filtered results
  displayFilteredPokemonList(filteredPokemons)
})