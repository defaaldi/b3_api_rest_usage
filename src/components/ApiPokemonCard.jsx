import { useState } from "react";
import { useEffect } from "react";

export const ApiPokemonCard = () => {

  // Estado para almacenar las imágenes de pokemones, lo inicializamos con un array vacío
  const [pokemons, setPokemons] = useState([]);
  // Estado para manejar posibles errores
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPokemons = async () => {
      // Recuperamos el listado de los pokemons
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=300&offset=0')
      const listPokemons = await response.json()
      const { results } = listPokemons // Guardamos el result

      // Ahora por cada result (pokemon), necesitamos obtener la información
      const newPokemons = results.map( async (pokemon) => {
        const response = await fetch(pokemon.url)
        const poke = await response.json()

        return {
          id: poke.id,
          name: poke.name,
          img: poke.sprites.other.dream_world.front_default
        }
      })

      // Como new pokemons retorna un array de promesas
      // necesitamos esperar a que se resuelvan todas
      // por eso recurrimos a Primise.all
      setPokemons(await Promise.all(newPokemons))
    }
    getPokemons()
  }, [])

  return (
    <div className='container mt-5'>
      <h2 className='text-center text-white mb-4'>Galería de Pokemones</h2>
      {/* Agregamos un contenedor scroll y altura fija */}
      <div className='row overflow-auto vh-80' style={{ maxHeight: '80vh', overflowY: 'scroll'}}>
      {
        pokemons.map(pokemon => {
          return (
          <div className='col-md-4 mb-4'>
            <div className='card h-100 d-flex flex-column'>
              <img src={pokemon.img} alt={pokemon.name} />
              <div className='card-body'>
              <h1 className='card-title'>{pokemon.name}</h1>
              <p className='card-text'>{pokemon.id}</p>
              </div>
              </div>
            </div>
          )})}
      </div>
    </div>
  )
}