import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooksByCategory, getBooksByCountry } from '../service/api';
import { Link } from "react-router-dom";
import './Redirigir.css';

const Filtros = () => {

    const { filtro, id_filtro } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navegacion = useNavigate();
    const [sortOrder, setSortOrder] = useState('asc');

    console.log('Estamos en este filtro', filtro);
    useEffect(() => {
        obtenerLibros(filtro, id_filtro);
    }, [filtro, id_filtro]);


    const obtenerLibros = async (filtro, id_filtro) => {
        setLoading(true);
        setError(null);

        try {
            let response = null;
            switch (filtro) {
                case "pais":
                    response = await getBooksByCountry(id_filtro);
                    break;
                case "categoria":
                    response = await getBooksByCategory(id_filtro);
                    break;
                default:
                    throw new Error('Filtro no valido');
            }

            console.log("Response de los filtros", response);
            if (response && response.status === 200) {
                setBooks(response.data);
            } else {
                throw new Error('Error en la carga de datos');
            }

        } catch (err) {
            setError(err.message);
            setBooks([]);
        } finally {
            setLoading(false); // Finalizar carga
        }
    };

    const sortBooks = (order) => {
        const sortedBooks = [...books].sort((a, b) => {
            if (order === 'asc') {
                return a.titulo.localeCompare(b.titulo);
            } else {
                return b.titulo.localeCompare(a.titulo);
            }
        });
        setBooks(sortedBooks);
    };

    const handleSortClick = (order) => {
        setSortOrder(order);
        sortBooks(order);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    console.log("Resultados dado el componente filttros", books);
    return (
        <div>
            <div className='contenedor-orden conteiner'>
                <div className="contenedor-flecha px-5" >
                    <div className='row'>
                        <i className="bi bi-arrow-left" id="otro-ordenar" onClick={() => navegacion('/')}></i>
                    </div>
                </div>
                <div className='boton-orden px-5'>
                    <button className="drown-ordenar" type="button" data-bs-toggle="dropdown" >
                        <span className="orden-texto">Orden del filtrado</span>
                        <i className="bi bi-caret-down-fill" id="flecha-orden"></i>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="orden-item" href="#" onClick={() => handleSortClick('asc')}>A - Z</a></li>
                        <li><a className="orden-item" href="#" onClick={() => handleSortClick('desc')}>Z - A</a></li>
                    </ul>
                </div>
            </div>
            <div className="contenedor-conciertos container">
                {books.length === 0 ? (
                    <p>No se encontraron coincidencias.</p>
                ) : (
                    books.map((book) => (
                        <Link
                            className="card menu-link"
                            key={book.id}
                            to={`/Libro/${book.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >

                            <img
                                className="img"
                                src={book.portada}
                                alt={book.titulo}
                            />

                            <div className="textos">
                                <h3>{book.titulo}</h3>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Filtros;