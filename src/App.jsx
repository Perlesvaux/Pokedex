// import { useState, useEffect } from 'react'
// import './App.css'
import './App.css'

import { StrictMode, useState, createContext, useContext, useEffect} from 'react';
// import { createRoot } from "https://esm.sh/react-dom/client?dev";


function Pokecard({ id }) {
   const [poke, setPoke] = useState({ id: null, name: null, sprite: null, moves: null })

   function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
   }


   function pickFour(json_obj) {
      const cap = Object.keys(json_obj).length;
      const unique_numbers = []
      const result = {}
      let dice = 0
      const limit = (cap > 4) ? 4 : cap;

      while (unique_numbers.length < limit)
      {
         dice = getRandomIntInclusive(0, cap)
         if (!unique_numbers.includes(dice)) unique_numbers.push(dice)
      }

      for (let each of unique_numbers)
      {
         if (json_obj[each] != undefined) result[each] = json_obj[each]
      }

      return result
   }


   async function requestPokemon() {
      try
      {
         const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
         const data = await res.json()
         const four_moves = pickFour(data.moves)
         return { id: data.id, name: data.name, sprite: data.sprites.front_default, moves: four_moves }


      } catch (error)
      {
         console.log(error)
      }
   }

   useEffect(() => {
      (async () => setPoke(await requestPokemon()))()
   }, [])


   return (<>
      <div className="card text-white bg-danger mb-3 text-center" style={{ width: "18rem" }} >
         <h1 className="card-header" style={{ color: "yellow", textShadow: "4px 2px SteelBlue", fontWeight: "heavy" }}>#{poke.id}</h1>
         {poke.sprite ?
            <img className="card-img-top" src={poke.sprite} alt={poke.name} style={{ borderRadius: "18px" }}></img>
            :
            <div className="loader"></div>
         }
         <div className="card-body">
            <h2 className="card-title text-capitalize" >{poke.name}</h2>

            <div className="dropdown">
               <button className="btn btn-warning dropdown-toggle " type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="bi bi-list"></i>
               </button>
               <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {poke.moves ?
                     Object.keys(poke.moves).map((index) => (<a className="dropdown-item" href="#" key={index}>{poke.moves[index].move.name}</a>))

                     : "loading"}
               </div>
            </div>

         </div>
      </div>



   </>)
}


function NavBar() {
   const [cachedPokes, setCachedPokes] = useState([])

   const [value, setValue] = useState({ current: "", data: {} })

   useEffect(() => {
      if (value.current.length < 3) return

      (async () => {
         const filtered = Object
            .keys(value.data)
            .filter(num => value.data[num].name.includes(value.current))

         const uncachedPokes = []
        console.log(filtered)

         for (const num of filtered)
         {
            if (cachedPokes.find(cachedPoke => cachedPoke.num === num))
            {
               continue
            }

            const uncachedPoke = { num, name: value.data[num].name }

            let info = await fetch(value.data[num].url)
            info = await info.json()

            let sprite = await fetch(info.sprites.front_default)
            sprite = await sprite.blob()
            sprite = URL.createObjectURL(sprite)

            uncachedPoke.sprite = sprite
            uncachedPokes.push(uncachedPoke)
          
         }

         setCachedPokes(prev => prev.concat(uncachedPokes))
      })()
   }, [value])

   function searching(event) {
      setValue({ ...value, current: event.target.value })
   }

   async function requestPokemon() {
      try
      {
         const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
         const data = await res.json()

         setValue({ ...value, data: data.results })

      } catch (error)
      {
         console.log(error)
      }
   }

   useEffect(() => {
      requestPokemon()
   }, [])

   console.log('cachedPokes external', cachedPokes)
   return (
      <>
         <nav className="navbar sticky-top navbar-light bg-light">
            <div className="container-fluid">
               <a className="navbar-brand" href="#">PokéDex</a>

               <form className="d-flex">
                  <input className="form-control me-2" type="search" placeholder="Look for a Pokemon" aria-label="Search" value={value.current} onChange={searching} />
                  <button className="btn btn-outline-success" type="submit">Search</button>
               </form>


            </div>
         </nav>
         <ul className="list-group">
            {value.current.length > 2 && cachedPokes
               .filter(poke => poke.name.includes(value.current))
               .map(poke => (
                  <li key={poke.num} className="list-group-item">
                     {poke.name}
                     {<img src={poke.sprite} alt={poke.name} />}
                  </li>
               ))
            }
         </ul>
      </>
   )
}


function App() {


   const pokemons = [1, 3, 4, 21, 72, 22, 11, 7, 9, 48, 35, 39, 14, 132]
   //Component logic goes here
   // <Pokecard id={}></Pokecard>
   // {pokemons.map(Pokemon)}
   // <Pokecard id={1}></Pokecard>

   return (<>
      <NavBar />
      <div className="d-flex flex-wrap justify-content-evenly">
         {pokemons.map((pid) => (<Pokecard key={pid} id={pid} />))}
      </div>

   </>)
}


export default App
// createRoot(document.getElementById("root")).render(<App />);
