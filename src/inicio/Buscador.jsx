import { useState } from "react";
import { getSearchByTittle } from "../service/api";
import { useNavigate } from 'react-router-dom';

const Buscador = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault(); 
    if (!search) return;

    try {
      const response = await getSearchByTittle(search);
      setResults(response.data); // Suponiendo que la API devuelve un array
      navigate('/Libro/busqueda/resultados', { state: { results: response.data } });
    } catch (error) {
      console.error('Error al buscar:', error);
    }

    
  };
  console.log("Estos son los resultados de la busqueda", results);
  return (
    <div className="form-search">
      <form role="search" onSubmit={handleSearch}>
        <div className="input-wrapper">
          <button  className= "btn-buscador" type="submit"><i className="bi bi-search"></i></button>
          <input
            value={search}
            onChange={handleChange}
            type="text"
            className="form-control"
            placeholder="Titulo del libro"
            maxLength="50"
          />
        </div>
      </form>
    </div>
  );
};

export default Buscador;

  