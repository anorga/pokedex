import { useParams } from "react-router-dom";

function Pokemon() {
  const { pokemonId } = useParams();
  console.log(pokemonId);
  return (
    <div>
      <h1>This is pokemon # {pokemonId}</h1>
      <p>Pokemon information goes here</p>
    </div>
  );
}

export default Pokemon;
