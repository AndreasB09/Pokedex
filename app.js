const mainContainer = document.getElementById("main-container");

const pokedexUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=3";

let pokemonList = [];

async function displayPokemonList() {
    await updatePokemonList(pokedexUrl);
    clearMainContainer();

    for (const pokemon of pokemonList.results) {
        const pokemonElement = document.createElement("div");
        pokemonElement.textContent = pokemon.url;
        mainContainer.appendChild(pokemonElement);
    }
}

function clearMainContainer() {
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
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

displayPokemonList();