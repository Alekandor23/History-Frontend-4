import axios from 'axios'

 const baseURL = 'https://history-backend-2.onrender.com'

const api = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    responseType: 'json',
    withCredentials: true,
});


export const getBooks = () => api.get('/libros')
export const getBookByID = (id) => api.get(`/libros/titulo/${id}`)
export const getDetailsByID = (id) => api.get(`/libros/detalles/${id}`)
export const getDescriptionsByID = (id) => api.get(`/libros/descripcion/${id}`)
export const getSummaryByID = (id) => api.get(`/libros/resumen/${id}`)
export const getSearchByTittle = (titulo) => api.get(`/libros/busqueda?query=${titulo}`)

export const loginUser = async (nombreUsuario, contrasenia) => {
    try {
        const response = await api.post('/iniciarSesion', { 
          nombreUsuarioI: nombreUsuario, 
          contraseniaI: contrasenia });
        
        return {
          response: response
        };
    } catch (error) {
        console.error('Error al iniciar sesión:', error.response.data);
        return {
          response: error.response
        };
    }
}

export const registerUser = async (nombreUsuario, nombre, apellido, correo, contrasenia) => {
  try {
    const response = await api.post('/registrar/usuario', {
      nombreUsuarioI: nombreUsuario,
      nombreI: nombre,
      apellidoI: apellido,
      correoI: correo,
      contraseniaI: contrasenia
    });
    console.log('Usuario:', response.data); // Asegúrate de acceder a response.data
    return {
      response: response
    };
  } catch (error) {
    console.error('Error al registrar usuario:', error.response ? error.response.data : error.message);
    return {
      response: error.response
    };
  };
};


export const getReviews = (bookID) => api.get(`/libros/${bookID}/resenias`) 

export const getUserReview = (userID, bookID) => api.get(`/libros/${bookID}/resenias/${userID}`) 

export const postUserReview = async (userID, bookID, descripcion, calificacion) => {
    try {
        const response = await api.post(`/libros/${bookID}/resenias/${userID}`, { 
          descripcionI: descripcion, 
          calificacionI: calificacion 
        });
        console.log('Resenia Creada:', response.data);
        return {
          response: response
        };
    } catch (error) {
        console.error('Error al escribir resenia:', error.response.data);
        return {
          response: error.response
        };
    }
}

export const deleteUserReview = async (userID, bookID) => {
    try {
        const response = await api.delete(`/libros/${bookID}/resenias/${userID}`);
        console.log('Resenia ELiminada:', response.data);
        return {
          response: response
        };
    } catch (error) {
        console.error('Error al eliminar resenia:', error.response.data);
        return {
          response: error.response
        };
    }
}

export const getCategories = () => api.get(`/libros/categorias`)

export const getCountries = () => api.get(`/libros/paises`)

export const getBooksByCategory = (categoryID) => api.get(`/libros/categorias/${categoryID}`)

export const getBooksByCountry = (countryID) => api.get(`/libros/paises/${countryID}`)
