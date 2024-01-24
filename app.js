const mainContainer = document.getElementById("main-container");
const buttonStart = document.getElementById("btn-start");
const buttonPrev = document.getElementById("btn-prev");
const buttonNext = document.getElementById("btn-next");
const buttonRandom = document.getElementById("btn-random");


const pokedexUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=3";
let pokemonList = [];

async function displayPokemonList() {
    await updatePokemonList(pokedexUrl);

    clearMainCOntainer();

    for (const pokemon of pokemonList.results) {
        const pokemonDetails = await getPokemonDetails(pokemon.url);
        displayPokemonDetails(pokemonDetails);
    }
}

function clearMainCOntainer() {
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
}

async function getPokemonDetails(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Pokemon details:", error);
        return null;
    }
}

function displayPokemonDetails(pokemonData) {
    if (!pokemonData) return;

    const { id, name, sprites } = pokemonData;

    const containerEl = document.createElement("div");
    containerEl.classList.add("pokemon-container");

    const numberEl = document.createElement("p");
    numberEl.textContent = `#${id}`;

    const titleEl = document.createElement("h2");
    titleEl.textContent = name;

    const imageEl = document.createElement("img");
    imageEl.alt = `Image of ${name}`;
    imageEl.src = sprites.other["official-artwork"].front_default;

    containerEl.appendChild(numberEl);
    containerEl.appendChild(titleEl);
    containerEl.appendChild(imageEl);

    mainContainer.appendChild(containerEl);
}

async function updatePokemonList(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        pokemonList = data;
    } catch (error) {
        console.error("Error fetching Pokemon list:", error);
    }
}

//button events
buttonStart.addEventListener("click", () => {
    displayPokemonList();
});

buttonNext.addEventListener("click", () => {
  if (pokemonList.next) {
    displayPokemonList(pokemonList.next);
  }
});

buttonPrev.addEventListener("click", () => {
  if (pokemonList.previous) {
    displayPokemonList(pokemonList.previous);
  }
});

displayPokemonList();