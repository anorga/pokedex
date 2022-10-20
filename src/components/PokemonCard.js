import { Link } from "react-router-dom";

function PokemonCard({ pokeData, loading }) {
  console.log(pokeData);
  return (
    <div className="relative px-4 pt-1 pb-1 bg-gray-50 sm:px-6 lg:pt-2 lg:pb-2 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-slate-400 h-[185rem] lg:h-[66rem]" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-5 mx-auto grid-cols-2 lg:grid-cols-5 max-w-lg  lg:max-w-none">
          {
          loading ? (
            <div>
              <h1 className="font-bold h-screen text-2xl">Loading...</h1>
              <div className=""></div>
            </div>
          ) : (
            pokeData.map((p) => {
              return (
                <div
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg"
                >
                  <div className="flex-shrink-0 bg-slate-200 hover:bg-slate-100">
                    <Link to="">
                      <img
                        className="object-cover w-full h-5/6"
                        src={p.sprites.front_default}
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
