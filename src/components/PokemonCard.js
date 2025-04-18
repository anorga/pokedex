import { Link } from "react-router-dom";

function PokemonCard({ pokeData, loading, filter }) {
  return (
    <div className="relative px-4 pt-1 pb-1 bg-white sm:px-6 lg:pt-2 lg:pb-2 lg:px-8 ">
      <div className="absolute inset-0 bg-white">
        <div className="bg-white h-screen sm:h-[185rem] md:h-[40rem] z-0" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-5 mx-auto grid-cols-2 lg:grid-cols-5 max-w-sm lg:max-w-5xl">
          {loading ? (
            <div>
              <h1 className="font-bold h-screen text-2xl">Loading...</h1>
              <div className=""></div>
            </div>
          ) : pokeData.length === 0 ? (
            <div className="col-span-2 lg:col-span-5 text-center">
              <h1 className="font-bold text-2xl">No Pokémon found</h1>
              <p>Try another search term</p>
            </div>
          ) : (
            pokeData.map((p) => {
              return (
                <div
                  key={p.id}
                  className="flex flex-col overflow-hidden border-4 border-black shadow-lg bg-white pixel-corners"
                >
                  <div className="flex-shrink-0 flex-col bg-white hover:bg-gray-100">
                    <Link to={`${p.id}`}>
                      <img
                        className="object-cover px-8 py-1"
                        // src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                        alt="project"
                      />
                      <p className="text-lg text-center hover:text-gray-500">
                        {`${p.id}. ${
                          p.name.charAt(0).toUpperCase() + p.name.slice(1)
                        }`}
                      </p>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
