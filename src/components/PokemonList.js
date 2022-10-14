function PokemonList({ pokemon }) {
  return (
    <>
      <div>
        {pokemon.map((p) => (
          <div key={Math.random()}>{p}</div>
        ))}
      </div>
    </>
  );
}

export default PokemonList;
