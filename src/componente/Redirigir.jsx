import { useNavigate } from 'react-router-dom';
import './Redirigir.css';
import React from 'react';

export const Redirigir = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();

  return (
    <div className="restringir-modal" onClick={onClose}>
      <div className="atras-restriccion" onClick={(e) => e.stopPropagation()}>
        <div className="tamaño-modal">
          <div className="nombre-restricciones">
            <h1 className="titulo-restriccion" id="titulo-restriccion">Advertencia</h1>
            <button type="button" className="cerrar-restriccion" onClick={onClose}>
              <span id="cerrar-restriccion" onClick={onClose}>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h5>Debe iniciar sesion para comentar</h5>
          </div>
          <div className="redirigir-botones">
            <button type="button" className="Ir-login" onClick={() => navigate('/Login')}>Ir a login</button>
            <button type="button" className="Ir-registro" onClick={() => navigate('/Registro')} >Ir a registro</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Eliminar = ({ isOpen, onClose, onDelete  }) => {
  if (!isOpen) return null;
  return (
    <div className="restringir-modal" onClick={onClose}>
      <div className="eliminar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tamaño-modal">
          <div className="nombre-restricciones">
            <h1 className="titulo-restriccion" id="titulo-restriccion">Confirmación</h1>
            <button type="button" className="cerrar-restriccion" onClick={onClose}>
              &times;
            </button>
          </div>
          <div class="modal-body">
            <h5>¿Esta seguro de quiere eliminar su reseña?</h5>
          </div>
          <div className="redirigir-botones">
            <button type="button" className="confirmar-eliminar" onClick={() => { onDelete(); onClose(); }}>Eliminar</button>
            <button type="button" className="cancelar-eliminar" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

