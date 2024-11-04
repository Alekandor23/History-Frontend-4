import React, { useState } from 'react';
import { registerUser } from '../service/api';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal'; // Asegúrate de que la ruta sea correcta
import './registroStyles.css';

const Registro = () => {
  const [formValues, setFormValues] = useState({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    correoElectronico: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActions, setModalActions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[A-Za-z0-9]+$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombreUsuario, contrasena, confirmarContrasena } = formValues;

    if (!validateUsername(nombreUsuario)) {
      setMessage('El nombre de usuario solo debe contener letras y números, sin espacios');
      setModalActions([{ label: 'Cerrar', onClick: () => setIsModalOpen(false) }]);
      setIsModalOpen(true);
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setMessage('Las contraseñas no coinciden');
      setModalActions([{ label: 'Cerrar', onClick: () => setIsModalOpen(false) }]);
      setIsModalOpen(true);
      return;
    }

    if (!validatePassword(contrasena)) {
      setMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial');
      setModalActions([{ label: 'Cerrar', onClick: () => setIsModalOpen(false) }]);
      setIsModalOpen(true);
      return;
    }

    try {
      const usuarioCreado = await registerUser(
        nombreUsuario,
        formValues.nombre,
        formValues.apellido,
        formValues.correoElectronico,
        contrasena
      );
      setMessage(usuarioCreado.response.data.message);
      setModalActions([{ label: 'Ir al login', onClick: () => navigate('/login') }]);
      setIsModalOpen(true);
    } catch (error) {
      if (error.response) {
        if (error.response.data.message === 'usuario') {
          setMessage('El usuario ya existe con este nombre de usuario');
        } else if (error.response.data.message === 'correo') {
          setMessage('El correo electrónico ya está registrado');
        } else {
          setMessage('Error al crear la cuenta');
        }
      } else {
        setMessage('Error al crear la cuenta');
      }
      setModalActions([{ label: 'Cerrar', onClick: () => setIsModalOpen(false) }]);
      setIsModalOpen(true);
    }
  };

  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setShowPassword(!showPassword);
    } else if (type === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleCancelClick = () => {
    setMessage('¿Seguro que quiere cancelar?');
    setModalActions([
      {
        label: 'Sí',
        onClick: () => {
          setFormValues({
            nombreUsuario: '',
            nombre: '',
            apellido: '',
            correoElectronico: '',
            contrasena: '',
            confirmarContrasena: ''
          });
          setIsModalOpen(false);
          navigate('/');
        }
      },
      { label: 'No', onClick: () => setIsModalOpen(false) }
    ]);
    setIsModalOpen(true);
  };

  return (
    <div className="registro-container">
      <div className="wrapper">
        <div className="registro_box">
          <Link to="/" className="login-header no-hover">
            <span>History House</span>
          </Link>
          <form onSubmit={handleSubmit}>
            <div className="input_box">
              <input
                type="text"
                id="Nombre"
                className="input-field"
                name="nombre"
                maxLength="30"
                value={formValues.nombre}
                onChange={handleChange}
                required
              />
              <label htmlFor="Nombre" className="label">Nombre(s)</label>
            </div>
            <div className="input_box">
              <input
                type="text"
                id="Apellido"
                className="input-field"
                name="apellido"
                maxLength="30"
                value={formValues.apellido}
                onChange={handleChange}
                required
              />
              <label htmlFor="Apellido" className="label">Apellido(s)</label>
            </div>
            <div className="input_box">
              <input
                type="text"
                id="Nombre de usuario"
                className="input-field"
                name="nombreUsuario"
                maxLength="40"
                value={formValues.nombreUsuario}
                onChange={handleChange}
                required
              />
              <label htmlFor="Nombre de usuario" className="label" maxLength="40">Nombre de usuario</label>
              <i className="bx bx-user icon"></i>
            </div>
            <div className="input_box">
              <input
                type="email"
                id="Correo electrónico"
                className="input-field"
                name="correoElectronico"
                maxLength="40"
                value={formValues.correoElectronico}
                onChange={handleChange}
                required
              />
              <label htmlFor="Correo electrónico" className="label">Correo electrónico</label>
            </div>
            <div className="input_box">
              <input
                type={showPassword ? 'text' : 'password'}
                id="Contraseña"
                className="input-field"
                name="contrasena"
                maxLength="20"
                value={formValues.contrasena}
                onChange={handleChange}
                required
              />
              <i
                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                id="ojito"
                onClick={() => togglePasswordVisibility('password')}
                style={{ cursor: 'pointer' }}
              ></i>
              <label htmlFor="Contraseña" className="label">Contraseña</label>
            </div>
            <div className="input_box">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="Confirmar contraseña"
                className="input-field"
                name="confirmarContrasena"
                maxLength="20"
                value={formValues.confirmarContrasena}
                onChange={handleChange}
                required
              />
              <i
                className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                id="ojitoConfirm"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                style={{ cursor: 'pointer' }}
              ></i>
              <label htmlFor="Confirmar contraseña" className="label">Confirmar contraseña</label>
            </div>
            <div className="input_box">
              <div className="button-group">
                <input type="submit" className="input-submit crear-cuenta" value="Crear cuenta" />
                <input
                  type="button"
                  className="input-submit cancelar"
                  value="Cancelar"
                  onClick={handleCancelClick}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={message}
        actions={modalActions}
      />
    </div>
  );
};

export default Registro;