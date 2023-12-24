"use strict";

import React, {
  StrictMode,
  useState,
  createContext,
  useContext,
  useEffect
} from "https://esm.sh/react?dev";
import { createRoot } from "https://esm.sh/react-dom/client?dev";


function Pokecard({id}){
  const [poke, setPoke] = useState({id:null, name:null, sprite:null, moves:null})

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min ) + min); // The maximum is exclusive and the minimum is inclusive
  }


  function pickFour(json_obj){
    const cap = Object.keys(json_obj).length;
    const unique_numbers = []
    const result = {}
    let dice = 0
    const limit = (cap>4)? 4 : cap;

    while (unique_numbers.length<limit){
      dice = getRandomIntInclusive(0, cap)
      if (!unique_numbers.includes(dice)) unique_numbers.push(dice)
    }

    for (let each of unique_numbers){
      if (json_obj[each] != undefined) result[each] = json_obj[each]
    }

    return result
  }


  async function requestPokemon(){
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      const data = await res.json()
      // setPoke({id: data.id, name:data.name, sprite:data.sprites.front_default})
      // const moves = []
      // for (let x in data.moves) moves.push(data.moves[x])
      // return {id: data.id, name:data.name, sprite:data.sprites.front_default, moves:moves }

      const four_moves = pickFour(data.moves)
      return {id: data.id, name:data.name, sprite:data.sprites.front_default, moves:four_moves }
      

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // const elpepe = await requestPokemon()
    (async ()=> setPoke(await requestPokemon()))()
  }, [])

  // function test(){
  //   // for (let x in poke.moves) console.log(poke.moves[x])
  //   if (poke.moves)
  // {
  //     // if (Object.keys(poke.moves).length>1) console.log(poke.moves[1])
  //     console.log(typeof poke.moves)
  //   }
  // }

  // test()


  return (<>
    <div className="card text-white bg-danger mb-3 text-center" style={ {width:"18rem"} } >
      <h1 className="card-header" style={{color:"yellow", textShadow:"4px 2px SteelBlue", fontWeight:"heavy"}}>#{poke.id}</h1>
      <img className="card-img-top" src={poke.sprite} alt={poke.name } style={ {borderRadius:"18px"} }></img>
      <div className="card-body">
        <h2 className="card-title text-capitalize" >{poke.name}</h2>

        <div className="dropdown">
        <button className="btn btn-warning dropdown-toggle " type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="bi bi-list"></i>
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {poke.moves? 
          Object.keys(poke.moves).map((index)=>(<a className="dropdown-item" href="#" key={index}>{poke.moves[index].move.name}</a>))

          : "loading"}
         </div> 
       </div>
        
      </div>
    </div>



  </>)
          // Object.keys(poke.moves).map((index)=>(<a className="dropdown-item" href="#" key={index}>{poke.moves[index].move.name}</a>))
}


function PokeSnap({source}){
  const [snap, setSnap] = useState({sprite:""})

  async function pokemonImage(imageUrl){
    try {
      const res = await fetch(imageUrl)
      const data = await res.json()

      setSnap({sprite:data.sprites.front_default})
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    pokemonImage(source)
  })

  return (<>{snap.sprite && <img src={snap.sprite}></img>}</>)
}




function NavBar(){
  const [value, setValue] = useState({current:"Look for a Pokemon", firstInteraction:0, data:{}})

  const filtered = Object.keys(value.data).filter((each)=>{
      return value.data[each].name.includes(value.current) //returns a list of indexes that match filter criteria
  })

  function searching(event){
    setValue({...value, current:event.target.value})
  }

  async function requestPokemon(){
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
      const data = await res.json()

      setValue({...value, data:data.results})

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    requestPokemon()
  }, [])


  return (<>
<nav className="navbar sticky-top navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Sticky top</a>

      <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={value.current} onChange={searching} />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
        
        <ul>

        {value.current.length>2 &&
            filtered.map((x)=>{
            return <>
                <li key={x}>{value.data[x].name}</li>
                <PokeSnap source={value.data[x].url}/>
              </>
        })}

        </ul>

  </div>
</nav>
  </>)
}


function App() {


  const pokemons = [1,3,4,21,72,22,11,7,9,48,35,39,14,132]
//Component logic goes here
    // <Pokecard id={}></Pokecard>
    // {pokemons.map(Pokemon)}
    // <Pokecard id={1}></Pokecard>

return (<>
    <NavBar />
    <div className="d-flex flex-wrap justify-content-evenly">
      {pokemons.map((pid)=>( <Pokecard key={pid} id={pid}/> ))}
    </div>

  </>)}


createRoot(document.getElementById("root")).render(<App />);
