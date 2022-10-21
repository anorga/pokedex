import { Link } from "react-router-dom";

function PokemonCard({ pokeData, loading }) {
  return (
    <div className="relative px-4 pt-1 pb-1 bg-slate-400 sm:px-6 lg:pt-2 lg:pb-2 lg:px-8 ">
      <div className="absolute inset-0 bg-slate-400">
        <div className="bg-slate-400 h-screen sm:h-[185rem] md:h-[40rem] z-0" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-5 mx-auto grid-cols-2 lg:grid-cols-5 max-w-sm  lg:max-w-5xl">
          {loading ? (
            <div>
              <h1 className="font-bold h-screen text-2xl">Loading...</h1>
              <div className=""></div>
            </div>
          ) : (
            pokeData.map((p) => {
              console.log(p.sprites);
              return (
                <div
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-2xl shadow-lg  bg-slate-200"
                >
                  <div className="flex-shrink-0 flex-col bg-slate-200 hover:bg-slate-100">
                    <Link to={`${p.id}`}>
                      <img
                        className="object-cover px-8 py-1"
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                        alt="project"
                      />
                      <p className="text-lg font-semibold text-center text-gray-900 hover:text-slate-500">
                        {`#${p.id} ${
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
