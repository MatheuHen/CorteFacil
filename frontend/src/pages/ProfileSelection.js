import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileSelection.css';

function ProfileSelection() {
  const navigate = useNavigate();

  const selecionarPerfil = (tipoPerfil) => {
    // Salva o tipo de perfil no localStorage
    localStorage.setItem('tipoPerfil', tipoPerfil);
    
    // Navega para a tela específica do perfil
    if (tipoPerfil === 'cliente') {
      navigate('/cliente-dashboard');
    } else if (tipoPerfil === 'barbeiro') {
      navigate('/barbeiro-dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoPerfil');
    navigate('/login');
  };

  return (
    <div className="profile-selection-container">
      <div className="profile-selection-card">
        <h2>Bem-vindo ao CorteFácil!</h2>
        <p>Selecione seu perfil para continuar:</p>
        
        <div className="profile-options">
          <div 
            className="profile-option cliente"
            onClick={() => selecionarPerfil('cliente')}
          >
            <div className="profile-icon">
              <span role="img" aria-label="Cliente">👤</span>
            </div>
            <h3>Cliente</h3>
            <p>Agendar cortes e gerenciar seus agendamentos</p>
          </div>
          
          <div 
            className="profile-option barbeiro"
            onClick={() => selecionarPerfil('barbeiro')}
          >
            <div className="profile-icon">
              <span role="img" aria-label="Barbeiro">✂️</span>
            </div>
            <h3>Barbeiro</h3>
            <p>Gerenciar agenda e atender clientes</p>
          </div>
        </div>
        
        <button className="logout-btn" onClick={logout}>
          Sair
        </button>
      </div>
    </div>
  );
}

export default ProfileSelection;