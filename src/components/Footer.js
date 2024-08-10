function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-gray-900 py-5 text-center text-white font-semibold z-10">
            <p>© {currentYear} Christian Anorga</p>
        </div>
    )
}

export default Footer;