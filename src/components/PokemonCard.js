function PokemonCard({ pokeData }) {
  console.log(pokeData);
  return (
    <div className="relative px-4 pt-1 pb-1 bg-gray-50 sm:px-6 lg:pt-2 lg:pb-2 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-gray-700 h-full" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-5 mx-auto grid-cols-2 lg:grid-cols-5 max-w-lg  lg:max-w-none">
          {pokeData.map((p) => {
            return (
              <div
                key={p.id}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg"
              >
                <div className="flex-shrink-0 bg-white hover:bg-blue-50">
                  <img
                    className="object-cover w-full h-full"
                    src={p.sprites.front_default}
                    alt="project"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 pb-6 pt-3 bg-white">
                  <div className="flex-1">
                    <a href=".." className="block">
                      <p className="text-xl font-semibold text-center text-gray-900 hover:text-red-800">
                        {`${p.id}. ${p.name.charAt(0).toUpperCase() + p.name.slice(1)}`}
                      </p>
                      {/* <p className="mt-3 text-base text-gray-500">{p.types}</p> */}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
