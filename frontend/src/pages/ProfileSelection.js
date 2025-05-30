import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import './ProfileSelection.css';

function ProfileSelection() {
  const [perfisDisponiveis, setPerfisDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    carregarPerfis();
  }, [navigate]);

  const carregarPerfis = async () => {
    try {
      const response = await api.get('/api/usuarios/perfis');
      setPerfisDisponiveis(response.data.perfis || []);
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
      alert('Erro ao carregar perfis. Por favor, tente novamente.');
      setPerfisDisponiveis([]);
    } finally {
      setLoading(false);
    }
  };

  const selecionarPerfil = async (tipoPerfil) => {
    try {
      await api.post('/api/usuarios/selecionar-perfil', { tipoPerfil });
      localStorage.setItem('tipoPerfil', tipoPerfil);
      
      if (tipoPerfil === 'cliente') {
        navigate('/cliente-dashboard');
      } else if (tipoPerfil === 'barbeiro') {
        navigate('/barbeiro-dashboard');
      }
    } catch (error) {
      console.error('Erro ao selecionar perfil:', error);
      alert('Erro ao selecionar perfil. Por favor, tente novamente.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoPerfil');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-selection-container">
        <div className="profile-selection-card">
          <h2>Carregando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-selection-container">
      <div className="profile-selection-card">
        <h2>Bem-vindo ao CorteFácil!</h2>
        <p>Selecione seu perfil para continuar:</p>
        
        <div className="profile-options">
          {Array.isArray(perfisDisponiveis) && perfisDisponiveis.includes('cliente') && (
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
          )}
          
          {Array.isArray(perfisDisponiveis) && perfisDisponiveis.includes('barbeiro') && (
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
          )}
        </div>
        
        <button className="logout-btn" onClick={logout}>
          Sair
        </button>
      </div>
    </div>
  );
}

export default ProfileSelection;