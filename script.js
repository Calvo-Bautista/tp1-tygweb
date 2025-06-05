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
const divPelicula = document.getElementById('pelicula');



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
            divResultados.classList.add('hidden');
            divSinApi.classList.add("hidden");
            divSinApi.classList.remove("sinApi");

            // Cargar Pokémon
            loadPokemons();
        } else if (apiNumber === '2') {
            // Mostrar mensaje de API 2 y ocultar contenedor de Pokémon
            pokemonContainer.classList.add('hidden');
            cartasPokemon.innerHTML = '';
            divPelicula.classList.remove('hidden');
            divSinApi.classList.add("hidden");
            divSinApi.classList.remove("sinApi");

            // clearContent(); // Limpiar contenido de resultados
            // fetchRandomRaceResult(); // Obtener resultado de carrera aleatorio
            verPelicula(); // Llamada a la función para mostrar la película
        }
    });
});



// Función para cargar los Pokémon iniciales
async function loadPokemons() {
    try {
        cartasPokemon.innerHTML = '';
        
        // Obtener lista de Pokémon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`);
        const data = await response.json();
        
        // Cargar cada Pokémon
        for (const pokemon of data.results) {
            await loadPokemonCard(pokemon.url);
        }
        
    } catch (error) {
        console.error('Error al cargar Pokémon:', error);
        cartasPokemon.innerHTML = '<p>Error al cargar Pokémon. Intenta nuevamente.</p>';
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
        
        
        // Agregar elementos a la tarjeta
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        
        // Agregar tarjeta al contenedor
        cartasPokemon.appendChild(card);
        
    } catch (error) {
        console.error('Error al cargar tarjeta de Pokémon:', error);
    }
}

// Función para formatear el nombre de la generación
function formatGeneration(generation) {
    // Convertir "generation-i" a "Generación I"
    const genNumber = generation.split('-')[1].toUpperCase();
    return `Generación ${genNumber}`;
}

async function verPelicula() {
    // const verAPI = document.getElementById("verAPI");
    const divPelicula = document.getElementById("pelicula");
    const API_KEY = 'f350efb6';
    const series = [
        "Breaking Bad",
        "Stranger Things",
        "The Office",
        "Game of Thrones",
        "Hunter x Hunter",
        "The Mandalorian",
        "The Witcher",
        "Dark",
        "Sherlock",
        "Drive to Survive",
        "The Last of Us"
    ];
    const serieAleatoria = series[Math.floor(Math.random() * series.length)];

    try {
        const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(serieAleatoria)}&type=series&apikey=${API_KEY}`);

        
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la API: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.Error) {
            throw new Error(data.Error);
        }

        divPelicula.innerHTML = `
            <div class="pelicula-info">
                <h2>${data.Title} (${data.Year})</h2>
                <img src="${data.Poster}" alt="Poster de ${data.Title}" class="poster-pelicula">
                <div class="detalles-pelicula">
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Actores:</strong> ${data.Actors}</p>
                    <p><strong>País:</strong> ${data.Country}</p>
                    <p><strong>Género:</strong> ${data.Genre}</p>
                    <p><strong>Trama:</strong> ${data.Plot}</p>
                </div>
            </div>
        `;
        divPelicula.style.display = "block";
    } catch (error) {
        console.error("Error al obtener la información de la película:", error);
        divPelicula.innerHTML = `
            <div class="error-mensaje">
                <p>Lo sentimos, hubo un error al cargar la información de la película.</p>
                <p>Por favor, intente nuevamente más tarde.</p>
            </div>
        `;
        divPelicula.style.display = "block";
    }
}