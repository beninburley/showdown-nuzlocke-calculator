import "./App.css";
import { PokemonSelect } from "./components/PokemonSelect";

function App() {
  const handlePokemon = () => {};

  return (
    <>
      <div>
        <h1>Choose your Pokémon</h1>
        <PokemonSelect onSelect={handlePokemon} />
      </div>
    </>
  );
}

export default App;
