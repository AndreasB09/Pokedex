const mainContainer = document.getElementById("main-container");

const pokedexUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=3";

async function displayPokemonList() {
    await updatePokemonList(pokedexUrl);

    for (const pokemon of pokemonList.results) {
        const pokemonDetails = await getPokemonDetails(pokemon.url);
        displayPokemonDetails(pokemonDetails);
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

displayPokemonList();