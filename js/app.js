import { 
  buttonStart, 
  buttonNext, 
  buttonPrev,
  buttonRandom,
  buttonSearch,
  errorMsg, 
  mainContainer, 
  searchInput
} from "./htmlElements.js"

import { getData } from "./data.js"


let pokemonList = []

// button events
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
 * @param {String} url
 */
const updatePokemonList = async (url) => pokemonList = await getData(url)

/**
 * @param {Number} perPage
 * @returns 
 */
const setLastPage = (perPage = 20) => pokemonList.lastPage = Math.floor(pokemonList.count/perPage)*perPage

async function displayPokemonList(url) {
  await updatePokemonList(url)
  setLastPage()

  console.log(pokemonList.results)

  mainContainer.innerHTML = ""

  const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
  }

  for (const pokemon of pokemonList.results) {

    const pokemonExtraData = await getData(pokemon.url)

    const containerEl = document.createElement("div")
    containerEl.classList.add("pokemon-container")
    const titleEl = document.createElement("h2")
    const upperCaseName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    titleEl.textContent = `${pokemonExtraData.id}. ${upperCaseName}`

    const imageEl = document.createElement("img")
    imageEl.alt = `image of ${pokemon.name}`
    imageEl.style = "max-width: 40%;"
    imageEl.src = pokemonExtraData.sprites.other["official-artwork"].front_default

    const typeContainer = document.createElement("div")
    typeContainer.classList.add("type-container")

    pokemonExtraData.types.forEach(typeData => {
      const typeEl = document.createElement("p")
      const upperCaseType = typeData.type.name.charAt(0).toUpperCase() + typeData.type.name.slice(1)
      typeEl.textContent = upperCaseType
      typeEl.classList.add("type-box")
      typeEl.style.backgroundColor = typeColors[typeData.type.name] || '#888'
      typeContainer.append(typeEl)
    });

    containerEl.append(titleEl, imageEl, typeContainer)
    mainContainer.append(containerEl)

    containerEl.addEventListener("click", () => displayPokemonDetails(pokemonExtraData))
  };
}

/**
 * @param {String} type
 * @param {Object} properties
 * @returns
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

  const {id, name, sprites, base_experience, height, weight, types, stats} = pokemonData

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

async function displayFilteredPokemonList(pokemonArray) {

  mainContainer.innerHTML = ""

  for (const pokemon of pokemonArray) {

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
  const searchText = searchInput.value.toLowerCase()
  if (searchText.length < 3) {
    displayError("Please enter 3 or more characters")
    return
  }
  displayError()

  const pokemonResult = await getData("https://pokeapi.co/api/v2/pokemon?offset=0&limit=-1")
  const pokemonArray = pokemonResult.results
  const filteredPokemons = pokemonArray.filter((pokemon) => {
    if (pokemon.name.includes(searchText)) {
      return true
    }
  
  })
  
  if (!filteredPokemons.length) {
    displayError("No pokemons found")
    return
  } 
  
  displayFilteredPokemonList(filteredPokemons)
})