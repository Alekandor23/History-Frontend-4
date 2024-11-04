import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './Inicio.css';
import logo from '../assets/logo.jpeg'
import Buscador from "./Buscador";
import { getCategories } from "../service/api";
import { getCountries} from "../service/api";
import { useUser } from "../contexts/userContext";
//import './Siber.css'

const Navbar = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const { user, setUser } = useUser();

  // Función para obtener las categorías
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data); // Almacena las categorías en el estado
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  // Abre el dropdown de categorías y carga las categorías si aún no están cargadas
  const handleCategoryClick = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    if (!categories.length) {
      fetchCategories();
    }
  };

  // Función para obtener los países
  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      setCountries(response.data); // Almacena los países en el estado
    } catch (error) {
      console.error("Error al obtener los países:", error);
    }
  };

  // Abre el dropdown de países y carga los países si aún no están cargados
  const handleCountryClick = () => {
    setIsCountryDropdownOpen(!isCountryDropdownOpen);
    if (!countries.length) {
      fetchCountries();
    }
  };
  
  const handleLogout = () => {
    setUser(null); // Limpia el estado del usuario en el contexto
    navigate('/'); // Redirige al usuario a la página de inicio
  };

  return (
    <>
      <div className="header" style={{ backgroundColor: '#001745' }}>
        <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
          <i className="bi bi-list"></i>
        </button>
        <div className="logo-nombre">
          <button className="logo-button" onClick={() => navigate('/')}>
            <div className="logo">
              <img src={logo} className="img-logo" alt="portada" />
            </div>
          </button>
          <div className="nombre-app">
            <h3>HistoryHouse</h3>
          </div>
        </div>
        <div className="contenedor-buscador">
          <Buscador></Buscador>
        </div>
        <div className="contenedor-usuario">
          <div className="dropdown">
            <a className="btn btn-secundario dropdown-user" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-person"></i>
              {user ? user.nombreUsuario : "Usuario"}
            </a>
            <ul className="dropdown-menu">
              {user ? (
                <li>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Cerrar sesión
                  </a>
                </li>
              ) : (
                <li>
                  <a className="dropdown-item" href="#" onClick={() => navigate('/Login')}>
                    Iniciar sesión
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div
        className="offcanvas offcanvas-start sidebar-custom"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
       >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Filtros</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        {/* --------------------------------------------------------------------------------------------------------------------------------------------------*/}
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={handleCategoryClick}>
                Categoria
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
              <ul className="list-group" style={{ maxHeight: categories.length > 5 ? '200px' : 'auto', overflowY: categories.length > 5 ? 'scroll' : 'visible' }}>
              {categories.length > 0 ? (
                categories
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((category) => (
                    <li key={category.id} className="list-group-item">
                      <button className="btn btn-link" onClick={() => navigate(`/Libros/categoria/${category.id}`)}>
                        <h6>{category.nombre}</h6>
                      </button>
                    </li>
                  ))
              ) : (
                <li className="list-group-item">Cargando categorías...</li>
              )}
            </ul>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" onClick={handleCountryClick} aria-expanded="false" aria-controls="collapseTwo">
                Pais
              </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body">

              <ul className={`list-group ${isCountryDropdownOpen ? 'show' : ''}`} style={{ maxHeight: 5 ? '370px' : 'auto', overflowY: 5 ? 'scroll' : 'visible' }}>
                  {countries.length > 0 ? (
                     [...countries]
                     .sort((a, b) => a.nombre.localeCompare(b.nombre))
                     .map((country) => (
                      <li key={country.id} className="list-group-item">
                        <button className="btn btn-link"  onClick={() => navigate(`/Libros/pais/${country.id}`)}>
                        <h6> {country.nombre}</h6>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">Cargando paises...</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;