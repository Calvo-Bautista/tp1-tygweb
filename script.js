const frases = [
        {texto: "Cuando veas la sombra de un gigante, no te asustes. Fíjate dónde está puesto el sol, porque puede ser la sombra que proyecta un enano. - Gustavo Alfaro", clase:"sombra1"},
        {texto: "Es más fácil desarticular un átomo que un preconcepto. - Gustavo Alfaro", clase: "sombra2"},
        {texto: "La esperanza es el sueño del hombre despierto. - Gustavo Alfaro", clase: "sombra3"}
    ]; 
// Array de frases con sus respectivas clases
const seleccion = frases[Math.floor(Math.random() * frases.length)];
const divFrases = document.getElementById("frase");
divFrases.textContent = seleccion.texto;
divFrases.classList.add(seleccion.clase);
// Seleccion de frases aleatorias y asignación de clase


document.getElementById('logo').addEventListener('click', function() {
    location.reload();
}); // Añadir evento de clic al logo para recargar la página



// Seleccionar elementos del DOM
const divSinApi = document.getElementById('sinApi');
const apiLinks = document.querySelectorAll('.api-link');
const mensajeElement = document.getElementById('mensaje');
const pokemonContainer = document.getElementById('pokemon-container');
const cartasPokemon = document.getElementById('pokemon-cards');
const barraBusqueda = document.getElementById('pokemon-search');
const searchButton = document.getElementById('search-button');




// Límite de Pokémon a mostrar inicialmente
const POKEMON_LIMIT = 20;

// Agregar evento de clic a cada enlace
apiLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const apiNumber = this.getAttribute('data-api');
        
        if (apiNumber === '1') {
            // Mostrar contenedor de Pokémon y ocultar mensaje
            pokemonContainer.classList.remove('hidden');
            mensajeElement.textContent = '';
            divSinApi.classList.add("hidden");
            divSinApi.classList.remove("sinApi");

            // Cargar Pokémon
            loadPokemons();
        } else if (apiNumber === '2') {
            // Mostrar mensaje de API 2 y ocultar contenedor de Pokémon
            pokemonContainer.classList.add('hidden');
            mensajeElement.textContent = `Soy la API ${apiNumber}`;
            cartasPokemon.innerHTML = '';
            divSinApi.classList.add("hidden");
            divSinApi.classList.remove("sinApi");
        }
    });
});

// Evento para el botón de búsqueda
searchButton.addEventListener('click', searchPokemon);

// Evento para buscar al presionar Enter en el campo de búsqueda
searchButton.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPokemon();
    }
});

// Función para cargar los Pokémon iniciales
async function loadPokemons() {
    try {
        showLoading(true);
        cartasPokemon.innerHTML = '';
        
        // Obtener lista de Pokémon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`);
        const data = await response.json();
        
        // Cargar cada Pokémon
        for (const pokemon of data.results) {
            await loadPokemonCard(pokemon.url);
        }
        
        showLoading(false);
    } catch (error) {
        console.error('Error al cargar Pokémon:', error);
        cartasPokemon.innerHTML = '<p>Error al cargar Pokémon. Intenta nuevamente.</p>';
        showLoading(false);
    }
}

// Función para buscar un Pokémon específico
async function searchPokemon() {
    const searchTerm = barraBusqueda.value.trim().toLowerCase();
    
    if (!searchTerm) {
        loadPokemons();
        return;
    }
    
    try {
        showLoading(true);
        cartasPokemon.innerHTML = '';
        
        // Intentar buscar por nombre exacto
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
            if (response.ok) {
                const data = await response.json();
                await loadPokemonCard(`https://pokeapi.co/api/v2/pokemon/${data.id}`);
                showLoading(false);
                return;
            }
        } catch (error) {
            // Si no se encuentra, continuamos con la búsqueda general
        }
        
        // Buscar en la lista completa
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        
        const filteredPokemon = data.results.filter(pokemon => 
            pokemon.name.includes(searchTerm)
        );
        
        if (filteredPokemon.length === 0) {
            cartasPokemon.innerHTML = '<p>No se encontraron Pokémon con ese nombre.</p>';
        } else {
            // Mostrar los primeros 20 resultados como máximo
            for (const pokemon of filteredPokemon.slice(0, 20)) {
                await loadPokemonCard(pokemon.url);
            }
        }
        
        showLoading(false);
    } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        cartasPokemon.innerHTML = '<p>Error al buscar Pokémon. Intenta nuevamente.</p>';
        showLoading(false);
    }
}

// Función para cargar una tarjeta de Pokémon
async function loadPokemonCard(url) {
    try {
        // Obtener datos del Pokémon
        const response = await fetch(url);
        const pokemon = await response.json();
        
        // Obtener datos de la especie para información adicional
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        
        // Obtener generación
        const generation = speciesData.generation.name;
        
        // Obtener cadena de evolución
        const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionChainData = await evolutionChainResponse.json();
        
        // Crear tarjeta de Pokémon
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        
        // Crear encabezado de la tarjeta
        const cardHeader = document.createElement('div');
        cardHeader.className = 'pokemon-card-header';
        cardHeader.innerHTML = `
            <h3>${pokemon.name}</h3>
            <p>#${pokemon.id.toString().padStart(3, '0')}</p>
        `;
        
        // Crear cuerpo de la tarjeta
        const cardBody = document.createElement('div');
        cardBody.className = 'pokemon-card-body';
        
        // Imagen del Pokémon
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                         pokemon.sprites.front_default;
        
        cardBody.innerHTML = `
            <img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-image">
            <div class="pokemon-info">
                <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                <p><strong>Generación:</strong> ${formatGeneration(generation)}</p>
            </div>
            <div class="pokemon-types">
                ${pokemon.types.map(type => 
                    `<span class="pokemon-type type-${type.type.name}">${type.type.name}</span>`
                ).join('')}
            </div>
        `;
        
        // Agregar cadena de evolución
        const evolutionChain = document.createElement('div');
        evolutionChain.className = 'evolution-chain';
        evolutionChain.innerHTML = '<h4>Evoluciones</h4>';
        
        const evolutionImages = document.createElement('div');
        evolutionImages.className = 'evolution-images';
        
        // Procesar cadena de evolución
        const evolutions = await processEvolutionChain(evolutionChainData.chain);
        
        if (evolutions.length <= 1) {
            evolutionImages.innerHTML = '<p>Este Pokémon no tiene evoluciones</p>';
        } else {
            for (let i = 0; i < evolutions.length; i++) {
                const evo = evolutions[i];
                
                const evoItem = document.createElement('div');
                evoItem.className = 'evolution-item';
                evoItem.innerHTML = `
                    <img src="${evo.image}" alt="${evo.name}">
                    <p>${evo.name}</p>
                `;
                
                evolutionImages.appendChild(evoItem);
                
                // Agregar flecha entre evoluciones
                if (i < evolutions.length - 1) {
                    const arrow = document.createElement('div');
                    arrow.className = 'evolution-arrow';
                    arrow.textContent = '→';
                    evolutionImages.appendChild(arrow);
                }
            }
        }
        
        evolutionChain.appendChild(evolutionImages);
        cardBody.appendChild(evolutionChain);
        
        // Agregar elementos a la tarjeta
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        
        // Agregar tarjeta al contenedor
        cartasPokemon.appendChild(card);
        
    } catch (error) {
        console.error('Error al cargar tarjeta de Pokémon:', error);
    }
}

// Función para procesar la cadena de evolución
async function processEvolutionChain(chain) {
    const evolutions = [];
    
    // Función recursiva para recorrer la cadena
    async function processChain(currentChain) {
        try {
            // Obtener ID del Pokémon actual
            const speciesUrl = currentChain.species.url;
            const pokemonSpecies = await fetch(speciesUrl).then(res => res.json());
            
            // Obtener datos del Pokémon
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonSpecies.id}`);
            const pokemon = await pokemonResponse.json();
            
            // Obtener imagen
            const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                             pokemon.sprites.front_default;
            
            // Agregar a la lista de evoluciones
            evolutions.push({
                name: currentChain.species.name,
                image: imageUrl
            });
            
            // Procesar evoluciones
            if (currentChain.evolves_to.length > 0) {
                // Por simplicidad, solo tomamos la primera rama de evolución
                await processChain(currentChain.evolves_to[0]);
            }
        } catch (error) {
            console.error('Error al procesar evolución:', error);
        }
    }
    
    await processChain(chain);
    return evolutions;
}

// Función para formatear el nombre de la generación
function formatGeneration(generation) {
    // Convertir "generation-i" a "Generación I"
    const genNumber = generation.split('-')[1].toUpperCase();
    return `Generación ${genNumber}`;
}




