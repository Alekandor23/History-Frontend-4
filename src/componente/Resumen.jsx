

const Resumen = ( {summary} ) => {
    return (

        <div className="contenedor-resumen">
            <div className="contenedor-title-resumen">
                <h1>Resumen</h1>
            </div>

            <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-3 rounded-2 texto-bonito" tabIndex="0">
                <h4 id="scrollspyHeading1"></h4>
                <p>{summary.resumen}</p>
            </div>
        </div>
    )
}

export default Resumen
