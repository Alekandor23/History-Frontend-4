import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../service/api';
import { useUser } from '../contexts/userContext';
import logo from '../assets/logo.jpeg';
import ModalLogin from './ModalLogin';

const Login = () => {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    nombreUsuario: '',
    contrasenia: ''
  });
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(0); // Estado para contar intentos fallidos

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const responseUsuario = await loginUser(credentials.nombreUsuario, credentials.contrasenia);
      const usuario = responseUsuario.response.data;

      console.log('Respuesta del login', responseUsuario);
      if (responseUsuario.response.status === 200) {
        setUser(usuario);
        alert('Usuario Logeado con exito');
        navigate('/');
      } else {
        setError(responseUsuario.response.data.message);
        setIsModalOpen(true); // Abre el modal en caso de error
        setAttempts(prevAttempts => prevAttempts + 1); // Incrementa el contador de intentos 
        if (attempts === 4) {
          alert("Demasiados intentos fallidos.");
        }else if(attempts >=4){
          alert("Demasiados intentos fallidos.");
          navigate('/');
        };
      }

    } catch (error) {
      setError(error.response.data.message || 'Error en la conexión');
      setIsModalOpen(true); // Abre el modal en caso de error
      setAttempts(prevAttempts => prevAttempts + 1); // Incrementa el contador de intentos
      if (attempts === 4) {
        alert("Demasiados intentos fallidos.");
      }else if(attempts >=4){
        alert("Demasiados intentos fallidos.");
        navigate('/');
      };
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="login">
      <div className="login-screen">
        <button className="logo-button" onClick={() => navigate('/')}>
          <div className="logo">
            <img src={logo} className="img-logo-login" alt="portada" />
          </div>
        </button>
        <div className="app-title">
          <h1>History House</h1>
        </div>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <div className="control-group">
              <input
                type="text"
                className="login-field"
                placeholder="Usuario"
                id="login-name"
                name="nombreUsuario"
                value={credentials.nombreUsuario}
                onChange={handleChange}
                required
              />
            </div>
            <div className="control-group">
              <input
                type="password"
                className="login-field"
                placeholder="Contraseña"
                id="login-pass"
                name="contrasenia"
                value={credentials.contrasenia}
                onChange={handleChange}
                required
              />
            </div>
            <div className="button-container">
              <button className="login-button" type="submit">Iniciar Sesión</button>
              <button className="signup-button" type="button" onClick={() => navigate('/Registro')}>
                Crear Usuario
              </button>
            </div>
          </form>
          {error && <ModalLogin isOpen={isModalOpen} onClose={closeModal} message={error} />} {/* Muestra el modal */}
        </div>
      </div>
    </div>
  );
};

export default Login;
