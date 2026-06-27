function Header( {h1, p} ) {
    return (
        <>
        <div>
        <h1 className="text-2xl font-bold text-base-content">{h1}</h1>
        <p className="text-sm text-base-content/60 mt-0.5">{p}</p>
        </div>
        </>
    )
}

export default Header;