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

import { getData } from "./data.js"
import { displayError } from "./displayError.js"

let pokemonList = []

//colors
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

//pokemon container
const createPokemonContainer = (pokemonData) => {
  const containerEl = document.createElement("div")
  containerEl.classList.add("pokemon-container")

  const baseContainer = document.createElement("div")
  baseContainer.classList.add("base-container")

  const titleEl = document.createElement("h2")
  const upperCaseName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
  titleEl.textContent = `${pokemonData.id}. ${upperCaseName}`

  const imageEl = document.createElement("img")
  imageEl.alt = `image of ${pokemonData.name}`
  imageEl.style = "max-width: 200px;"
  imageEl.src = pokemonData.sprites.other["official-artwork"].front_default

  const typeContainer = document.createElement("div")
  typeContainer.classList.add("type-container")

  pokemonData.types.forEach(typeData => {
    const typeEl = document.createElement("p")
    const upperCaseType = typeData.type.name.charAt(0).toUpperCase() + typeData.type.name.slice(1)
    typeEl.textContent = upperCaseType
    typeEl.classList.add("type-box")
    typeEl.style.backgroundColor = typeColors[typeData.type.name] || '#888'
    typeContainer.append(typeEl)
  })

  baseContainer.append(titleEl, imageEl, typeContainer)

  const statsContainer = document.createElement("div")
  statsContainer.classList.add("stats-container")

  pokemonData.stats.forEach((stat) => {
    const { base_stat, stat: statName } = stat
    const formattedStatName =
      statName.name === "special-attack"
        ? "Special Attack"
        : statName.name === "special-defense"
          ? "Special Defense"
          : statName.name.charAt(0).toUpperCase() + statName.name.slice(1)
    const statEl = document.createElement("p")
    statEl.textContent = `${formattedStatName}: ${base_stat}`
    statsContainer.append(statEl)
  });

  containerEl.append(baseContainer, statsContainer)

  return containerEl
}

async function displayPokemonList(url) {
  await updatePokemonList(url);
  setLastPage();

  console.log(pokemonList.results);

  mainContainer.innerHTML = "";

  for (const pokemon of pokemonList.results) {
    const pokemonExtraData = await getData(pokemon.url);
    const containerEl = createPokemonContainer(pokemonExtraData);

    containerEl.addEventListener("click", () => displayPokemonDetails(pokemonExtraData));
    mainContainer.append(containerEl);
  }
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

//new pokemon details - just shows the card but it's coherrent for now
async function displayPokemonDetails(pokemonData) {
  mainContainer.innerHTML = "";
  const containerEl = createPokemonContainer(pokemonData);
  mainContainer.append(containerEl);
}

// async function displayPokemonDetails(pokemonData) {
//   mainContainer.innerHTML = ""

//   const {id, name, sprites, base_experience, height, weight, types, stats} = pokemonData

//   const containerEl = makeElement()
//   const titleEl = makeElement("h2", { textContent: `${id}. ${name}`})

//   const imageEl = makeElement("img", {
//     alt: `image of ${name}`,
//     style: "max-width: 40%;",
//     src: sprites.other["official-artwork"].front_default
//   })

//   const xpEl = makeElement("p", { textContent: `XP: ${base_experience}`})
//   const heightEl = makeElement("p", {textContent: `Height: ${height/10} M`})
//   const weightEl = makeElement("p", {textContent: `Weight: ${weight/10} Kg`})
//   const typesContainer = makeElement("div")
//   const typesHeaderEl = makeElement("h3", {textContent: "Types:"})
//   typesContainer.append(typesHeaderEl)

//   types.forEach(type => {
//     const typeEl = document.createElement("p")
//     typeEl.textContent = type.type.name
//     typesContainer.append(typeEl)
//   })

//   const statsContainer = document.createElement("div")
//   const statsHeaderEl = document.createElement("h3")
//   statsHeaderEl.textContent = "Stats:"
//   statsContainer.append(statsHeaderEl)

//   stats.forEach(value => {
//     const {stat, base_stat, effort} = value
//     const statEl = document.createElement("p")
//     statEl.textContent = 
//       `${stat.name}: ${base_stat} (effort: ${effort})`

//     statsContainer.append(statEl)
//   })

//   containerEl.append(titleEl, imageEl, xpEl, heightEl, weightEl, typesContainer, statsContainer)
//   mainContainer.append(containerEl)
// }

displayPokemonList()

async function displayFilteredPokemonList(pokemonArray) {
  mainContainer.innerHTML = "";

  for (const pokemon of pokemonArray) {
    const pokemonExtraData = await getData(pokemon.url);
    const containerEl = createPokemonContainer(pokemonExtraData);

    containerEl.addEventListener("click", () => displayPokemonDetails(pokemonExtraData));
    mainContainer.append(containerEl);
  }
}

//search function
const searchField = async () => {
  const searchText = searchInput.value.toLowerCase();
  if (searchText.length < 3) {
    displayError("Please enter 3 or more characters")
    return
  }
  displayError()

  const pokemonResult = await getData("https://pokeapi.co/api/v2/pokemon?offset=0&limit=-1")
  const pokemonArray = pokemonResult.results
  const filteredPokemons = pokemonArray.filter((pokemon) => pokemon.name.includes(searchText))

  if (!filteredPokemons.length) {
    displayError("No pokemons found")
    return;
  }

  displayFilteredPokemonList(filteredPokemons);
}

buttonSearch.addEventListener("click", searchField)

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchField()
  }
})

buttonRandom.addEventListener("click", async () => {
  const totalCountResponse = await fetch("https://pokeapi.co/api/v2/pokemon")
  const totalCountData = await totalCountResponse.json()
  const totalCount = totalCountData.count
  const randomIndex = Math.floor(Math.random() * totalCount) + 1

  const randomPokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomIndex}`)
  const randomPokemonData = await randomPokemonResponse.json();

  mainContainer.innerHTML = ""

  const containerEl = createPokemonContainer(randomPokemonData)
  
  containerEl.addEventListener("click", () => displayPokemonDetails(randomPokemonData))
  mainContainer.append(containerEl)
})