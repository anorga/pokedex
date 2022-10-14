function PokemonList({ pokemon }) {
  return (
    <div className="ml-5 my-5">
      <table className="border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className="border-collapse border border-slate-500 px-4 py-2">
              Pokemon Name
            </th>
            <th className="border-collapse border border-slate-500 px-4 py-2">
              Pokemon Sprite
            </th>
          </tr>
        </thead>
        <tbody>
          {pokemon.map((p) => (
            <tr key={p}>
              <td className="border-collapse border border-slate-500 px-4 py-2">{p}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PokemonList;
