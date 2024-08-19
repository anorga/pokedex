import pokeball from "./assets/pokeball.png";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-gray-900 py-5 text-center text-white font-semibold z-10 text-2xl">
            <p className="flex items-center justify-center">
                <img src={pokeball} alt="Pokeball" className="w-4 h-4 mr-1" />
                {currentYear} Christian Anorga
            </p>
        </div>
    )
}

export default Footer;