import { FaStar } from 'react-icons/fa';
import { postUserReview, getUserReview, getReviews, deleteUserReview } from '../service/api';
import { useState, useEffect } from 'react';
import React from 'react';
import './Comentario.css';
import { useUser } from '../contexts/userContext';
import { Eliminar } from "./Redirigir";

const Comentario = ({ isOpen, onClose, bookID }) => {
    if (!isOpen) return null;
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    const [reviewText, setReviewText] = useState(''); // Estado para el contenido de la reseña
    const { user } = useUser();
    const [userReview, setReview] = useState(null);
    const [userReviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [restriccionAbierta, setRestriccionAbierta] = useState(false);
    const [showMore, setShowMore] = useState(false); // Estado para "Ver más/Ver menos"


    console.log('Usuario utilizado desde el modal de resenias', user);

    // Función para manejar la cancelación
    const Cancelar = () => {
        setRating(0); // Reiniciar estrellas
        setReviewText(''); // Limpiar texto de la reseña
        setMessage(''); // Limpiar mensaje
    };

    const obtenerDatos = async () => {
        setLoading(true); //Cargamos las resenias 
        try {
            const [userReviewResponse, reviewsResponse] = await Promise.all([
                getUserReview(user.id, bookID),
                getReviews(bookID)
            ]);

            //Respuestas de las solicitudes a los APIs
            console.log('User Review Response: ', userReviewResponse);
            console.log('Reviews Response: ', reviewsResponse);

            // Comprobar que todas las respuestas son satisfactorias
            if (userReviewResponse.status !== 200 || reviewsResponse.status !== 200) {
                throw new Error('Error en la carga de datos');
            }

            // Establecer los datos en el estado
            setReview(userReviewResponse.data);
            setReviews(reviewsResponse.data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        };
    };

    console.log('User Reviews', userReviews);
    useEffect(() => {
        obtenerDatos();
    }, [user.id, bookID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setMessage('Por favor, selecciona una calificación de estrellas.');
            return;
        }
        try {
            const respuesta = await postUserReview(user.id, bookID, reviewText, rating);
            setMessage(respuesta.response.data.message || 'Reseña creada exitosamente');
            console.log('Reseña Creada:', respuesta);
            obtenerDatos();
        } catch (error) {
            setMessage('Error al crear reseña');
            console.error('Error al escribir reseña:', error.response ? error.response.data : error.message);
        }
    };

    const formatearFecha = (fecha) => {
        const fecha_publicacion = new Date(fecha);
        const anio = fecha_publicacion.getUTCFullYear();
        const mes = String(fecha_publicacion.getUTCMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const dia = String(fecha_publicacion.getUTCDate()).padStart(2, '0');
        return `${dia}/${mes}/${anio}`;
    }

    const EliminarReseña = async () => {
        try {
            const respuesta = await deleteUserReview(user.id, bookID);
            setMessage(respuesta.response.data.message || 'Reseña eliminada exitosamente');
            console.log('Reseña Eliminada:', respuesta);
            setReviewText('');
            setRating(0);
            obtenerDatos();
        } catch (error) {
            setMessage('Error al eliminar la reseña');
            console.error('Error al eliminar reseña:', error.response ? error.response.data : error.message);
        }
    };

    const toggleModal = () => {
        user ? setModalOpen(!isModalOpen) : setRestriccionAbierta(!restriccionAbierta);
    };

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const truncateText = (text) => {
        if (text.length > 150) {
            return showMore ? text : `${text.substring(0, 150)}...`;
        }
        return text;
    };

    return (
        //Eliminar el comentario
        <div className="comentario-overlay " onClick={onClose}>
            <div className="comentario-content" onClick={(e) => e.stopPropagation()}>
                <span id="cerrar-comentario" onClick={onClose}>&times;</span>
                {/* Estados de carga y error */}
                {loading && <div style={{backgroundColor: "#f0afad"}}>Cargando...</div>}
                {error && <div style={{backgroundColor: "#f0afad"}}>Error: {error}</div>}
                {/*empiezo de los contenedores del adentro*/}
                {userReview ? (

                    <div className='comentario-principal'>
                        <h1 className='titulo-reseña'>Tu reseña</h1>
                        <div className='usuario-comentario'>
                            <div className='rating'>
                                <i class="bi bi-person-circle" id='circulo-user'></i>
                                <p>{user.nombreUsuario}</p>{/*Aqui viene el nombre del usuario*/}
                                <p>{formatearFecha(userReview.fecha_publicacion)}</p>
                                {[...Array(5)].map((star, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <label key={index}>
                                            <input type="radio" name="rating" value={ratingValue} />
                                            <FaStar className="star" color={ratingValue <= userReview.calificacion ? 'gold' : 'darkgray'} size={34} />
                                        </label>
                                    );
                                })}
                                {message && <p className="message">{message}</p>}
                            </div>
                            <div className='escribir-contenedor px-5'>
                                <p className="escribir-control" style={{ whiteSpace: 'pre-wrap' }}>
                                    {showMore ? userReview.descripcion : `${userReview.descripcion.slice(0, 150)}...`}
                                </p>
                                {userReview.descripcion.length > 150 && (
                                    <span
                                        onClick={toggleShowMore}
                                        style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        {showMore ? 'Ver menos' : 'Ver más'}
                                    </span>
                                )}
                                <div className="botones-contenedor">
                                    <button className="btn-cancelar" onClick={toggleModal}>Elminar</button>

                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Publicar la reseña

                    <div className='comentario-principal'>
                        <h1 className='titulo-reseña'>Tu reseña</h1>
                        <div className='usuario-comentario'>
                            <div className='rating'>
                                <i class="bi bi-person-circle" id='circulo-user'></i>
                                <p>{user.nombreUsuario}</p>{/*Aqui viene el nombre del usuario*/}
                                {[...Array(5)].map((star, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <label key={index}>
                                            <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} />
                                            <FaStar className="star" color={ratingValue <= rating ? 'gold' : 'darkgray'} size={34} />
                                        </label>
                                    );
                                })}
                                {message && <p className="message">{message}</p>}
                            </div>
                            <div className='escribir-contenedor px-5'>
                                <textarea type="text" className="escribir-control"
                                    placeholder="Escribir Reseña (Opcional)"
                                    value={reviewText} // Valor del estado
                                    maxLength="500"
                                    onChange={(e) => setReviewText(e.target.value)} />
                                <div className="botones-contenedor">
                                    <button className="btn-cancelar" onClick={Cancelar}>Cancelar</button>
                                    <button className="btn-publicar" onClick={handleSubmit}>Publicar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Mostrar otras reseñas */}
                {userReviews.map((review) => {
                    if (userReview && userReview.id === review.id) {
                        return null;
                    }
                    return (
                        <div className='comentario-contenedor' key={review.id}>
                            <div className='usuario-comentario'>
                                <div className='rating'>
                                    <i className="bi bi-person-circle" id='circulo-user'></i>
                                    <p>{review.usuario.nombreUsuario}</p>
                                    <p>{formatearFecha(review.fecha_publicacion)}</p>
                                    {[...Array(5)].map((star, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <label key={index}>
                                                <input type="radio" name="rating" value={ratingValue} />
                                                <FaStar className="star" color={ratingValue <= review.calificacion ? 'gold' : 'darkgray'} size={34} />
                                            </label>
                                        );
                                    })}
                                </div>
                                <div className='escribir-contenedor px-5'>
                                    <p>
                                        {showMore ? review.descripcion : truncateText(review.descripcion) }
                                        {review.descripcion.length > 150 && (
                                            <span
                                                onClick={toggleShowMore}
                                                className="link-text"
                                            >
                                                {showMore ? 'Ver menos' : 'Ver más'}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {/* Modal de confirmación */}
                <Eliminar
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onDelete={EliminarReseña}
                />
            </div>
        </div>
    );
};


export default Comentario;
