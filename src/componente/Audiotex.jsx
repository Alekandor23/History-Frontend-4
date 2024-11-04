import { useNavigate, useParams } from "react-router-dom";
import { getSummaryByID, getBookByID } from "../service/api";
import { useEffect, useState } from "react";
import Reproductor from "./Reproductor";

const Audiotex = () => {
  const navegacion = useNavigate();
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paragraphs, setParagraphs] = useState([]); // Cambiado a arreglo de párrafos
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

  useEffect(() => {
    const obtenerDatos = async () => {
      setLoading(true);
      try {
        const [summaryResponse, bookResponse] = await Promise.all([
          getSummaryByID(id),
          getBookByID(id),
        ]);
        if (summaryResponse.status !== 200 || bookResponse.status !== 200) {
          throw new Error("Error al obtener los datos");
        }
        setSummary(summaryResponse.data);
        setBook(bookResponse.data);
        // Dividir el resumen en párrafos y guardarlos en un arreglo
        const parrafos = summaryResponse.data.resumen.split(/(?:\n| {2,})/).filter(parrafo => parrafo.trim() !== "");
        setParagraphs(parrafos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    obtenerDatos();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderTextoKaraoke = () => {
    if (!paragraphs.length) return null;

    return paragraphs.map((parrafo, index) => (
      <div
        key={index}
        className={`parrafo ${index === currentParagraphIndex ? 'active' : ''}`}
        onClick={() => setCurrentParagraphIndex(index)}
        style={{ cursor: 'pointer' }}
      >
        {parrafo}
      </div>
    ));
  };

  return (
    <div className="contenedor-audiotex">
      <div className="contenedor-flecha">
        <div className="row">
          <i className="bi bi-arrow-left" id="otro" onClick={() => navegacion(-1)}></i>
        </div>
      </div>
      <div className="contenedor-textoaudio">
        {book && (
          <div className='titulo-del-audiolibro'>
            <h1>{book.titulo}</h1>
          </div>
        )}
        <div
          data-bs-spy="scroll"
          data-bs-target="#navbar-example2"
          data-bs-root-margin="0px 0px -40%"
          data-bs-smooth-scroll="true"
          className="scrollspy-textoaudio bg-body-tertiary p-3 rounded-2 texto-bonito"
          tabIndex="0"
        >
          {renderTextoKaraoke()}
        </div>
      </div>
      <Reproductor
        paragraphs={paragraphs}  // Propiedad actualizada a `paragraphs`
        setCurrentParagraphIndex={setCurrentParagraphIndex}
        currentParagraphIndex={currentParagraphIndex} 
        onClose={() => {}}
      />
      <style jsx>{`
        .parrafo {
          background-color: #d1bda3;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 5px;
        }
        .active {
          background-color: rgba(255, 0, 0, 0.2);
          color: red;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default Audiotex;