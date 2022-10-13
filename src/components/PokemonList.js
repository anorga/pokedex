const PokemonList = ({ pokemon }) => {
  return (
    <>
      <div>
        <h1>POKEMON POKEDEX</h1>
        {pokemon.map((p) => (
          <div key={p}>{p}</div>
        ))}
      </div>
    </>
  );
};

export default PokemonList;
