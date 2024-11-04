

const Detalles = ({ details }) => {
  const fecha_publicacion = new Date(`${details.fecha_publicacion}`);
  const anio = fecha_publicacion.getUTCFullYear();
  const mes = String(fecha_publicacion.getUTCMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const dia = String(fecha_publicacion.getUTCDate()).padStart(2, '0');

  const fecha_publicacion_formateada = `${dia}/${mes}/${anio}`;

  console.log('Fecha formateada', fecha_publicacion_formateada)

  return (
    <div className="contenedor-detalle">
      
        <div className="contenedor-title-detalles">
        <h1 >Detalles del libro</h1>
        </div>

        <div className="contenedor-de-detalles" >


          <div className="detalles-box">
            <h6>Autor:  {details.autor.nombre}</h6>
          </div>

          <div className="detalles-box">
            <h6>Editorial: {details.editorial.nombre}</h6>
          </div>

          <div className="detalles-box">
            <h6>Número de páginas: {details.numero_paginas}</h6>
          </div>

          <div className="detalles-box">
            <h6>Fecha de publicación: {fecha_publicacion_formateada}</h6>
          </div>

          <div className="detalles-box">
            <h6>Categoria: {details.categoria.nombre}</h6>
          </div>

        </div>
      </div>
    
  )
}

export default Detalles
