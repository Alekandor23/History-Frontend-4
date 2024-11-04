import { useEffect, useState } from "react"
import Descripcion from "./Descripcion";
import Detalles from "./Detalles";
import Resumen from "./Resumen";
import Comentario from './Comentario';
import { useNavigate, useParams } from 'react-router-dom'
import './Libro.css'
import { getBookByID, getDetailsByID, getDescriptionsByID, getSummaryByID } from "../service/api";
import { useUser } from "../contexts/userContext";
import { Redirigir } from "./Redirigir";

const Libro = ({ onShowReproductor }) => {

  const navegacion = useNavigate();

  const { id } = useParams(); // Obtén el ID del libro de la URL
  const [book, setBook] = useState(null);
  const [details, setDetails] = useState(null);
  const [descriptions, setDescriptions] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  //condicion de  enetrar  a  audio 
  const navigate = useNavigate();


  //aqui esta  el estado de  las  pantallas 


  const [cambio, setCambio] = useState('DETALLES');

  const [isModalOpen, setModalOpen] = useState(false);
  const [restriccionAbierta, setRestriccionAbierta] = useState(false);
  console.log('Usuario utilizado desde el libro.jsx', user);
  const toggleModal = () => {
    user ? setModalOpen(!isModalOpen) : setRestriccionAbierta(!restriccionAbierta);
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      setLoading(true); // Iniciar carga
      try {
        const [bookResponse, detailsResponse, descriptionsResponse, summaryResponse] = await Promise.all([
          getBookByID(id),
          getDetailsByID(id),
          getDescriptionsByID(id),
          getSummaryByID(id),
        ]);

        // Imprimir las respuestas para depuración
        console.log('Book Response:', bookResponse);
        console.log('Details Response:', detailsResponse);
        console.log('Descriptions Response:', descriptionsResponse);
        console.log('Summary Response:', summaryResponse);

        // Comprobar que todas las respuestas son satisfactorias
        if (bookResponse.status !== 200 || detailsResponse.status !== 200 || descriptionsResponse.status !== 200 || summaryResponse.status !== 200) {
          throw new Error('Error en la carga de datos');
        }

        // Establecer los datos en el estado
        setBook(bookResponse.data);
        setDetails(detailsResponse.data);
        setDescriptions(descriptionsResponse.data);
        setSummary(summaryResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    obtenerDatos();
  }, [id]);


  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;



  const botones = () => {
    if (cambio === 'DETALLES') {
      return <Detalles details={details} />;
    } else if (cambio === 'DESCRIPCION') {
      return <Descripcion descriptions={descriptions} />;
    } else {
      return <Resumen summary={summary} />;
    }
  };



  const handleIconClick = () => {
    navigate(`/Libro/${id}/Audiotex`); // Cambia '/ruta-deseada' a la ruta que desees
    onShowReproductor(); //mostrar reproductor
  };




  return (

    <>
      <div className="contenedor-flecha-navbar2" >

        <div className="contenedor-flecha" >
          <div className='row'>
            <i className="bi bi-arrow-left" id="otro" onClick={() => navegacion(-1)}></i>
          </div>
        </div>

        <div className='container' id='navbar12'>
          <div className='contenedor-botones'>

            <button type="button"
              className={`boton-navbar ${cambio === 'DETALLES' ? 'active' : ''}`}
              onClick={() => setCambio('DETALLES')}>Detalles</button>

            <button
              type="button"
              className={`boton-navbar ${cambio === 'DESCRIPCION' ? 'active' : ''}`}
              onClick={() => setCambio('DESCRIPCION')}>Descripcion</button>
            <button
              type="button"
              className={`boton-navbar ${cambio === 'RESUMEN' ? 'active' : ''}`}
              onClick={() => setCambio('RESUMEN')}>Resumen</button>
          </div>
        </div>
      </div>





      <div className="contenedor-de-libros " >

        <div className="contenedor-completo">
          <div className="contenedor-portada">

            <img className="imagen-portada" src={book.portada} alt={book.titulo} />

          </div>
          <div className="contenetor-titulo">
            <h4>{book.titulo}</h4>
            <div className="libro-audio">

              <button className="btn-leer" type="button" onClick={handleIconClick}>
                <i className="bi bi-headphones" id="otro1"></i>
              </button>
              <button className="btn-leer" type="button" onClick={toggleModal}>
                <i class="bi bi-chat-square-text"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="contenedor-DDR">
          {botones()}
          {isModalOpen && (
            <Comentario isOpen={isModalOpen} bookID={id} onClose={toggleModal} />
          )}
          <Redirigir
            isOpen={restriccionAbierta}
            onClose={() => setRestriccionAbierta(false)}
          />
        </div>
      </div>

    </>
  )
}

export default Libro
