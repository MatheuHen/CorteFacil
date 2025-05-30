import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import './ClienteDashboard.css';

function ClienteDashboard() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    data: '',
    horario: '',
    servico: 'corte'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tipoPerfil = localStorage.getItem('tipoPerfil');
    
    if (!token || tipoPerfil !== 'cliente') {
      navigate('/login');
      return;
    }
    
    carregarAgendamentos();
  }, [navigate]);

  const carregarAgendamentos = async () => {
    try {
      const response = await api.get('/api/agendamentos/cliente');
      setAgendamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      alert('Erro ao carregar agendamentos. Por favor, tente novamente.');
    }
  };

  const agendarServico = async () => {
    if (!novoAgendamento.data || !novoAgendamento.horario) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
    
    try {
      const response = await api.post('/api/agendamentos', novoAgendamento);
      setAgendamentos([...agendamentos, response.data]);
      setNovoAgendamento({ data: '', horario: '', servico: 'corte' });
      alert('Agendamento realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Por favor, tente novamente.');
    }
  };

  const cancelarAgendamento = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        await api.delete(`/api/agendamentos/${id}`);
        setAgendamentos(agendamentos.filter(ag => ag._id !== id));
        alert('Agendamento cancelado com sucesso!');
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        alert('Erro ao cancelar agendamento. Por favor, tente novamente.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoPerfil');
    navigate('/login');
  };

  const voltarSelecao = () => {
    navigate('/profile-selection');
  };

  return (
    <div className="cliente-dashboard">
      <header className="dashboard-header">
        <h1>Dashboard do Cliente</h1>
        <div className="header-buttons">
          <button onClick={voltarSelecao} className="btn-secondary">
            Trocar Perfil
          </button>
          <button onClick={logout} className="btn-logout">
            Sair
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="novo-agendamento">
          <h2>Novo Agendamento</h2>
          <div className="form-group">
            <label>Data:</label>
            <input
              type="date"
              value={novoAgendamento.data}
              onChange={(e) => setNovoAgendamento({...novoAgendamento, data: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label>Horário:</label>
            <input
              type="time"
              value={novoAgendamento.horario}
              onChange={(e) => setNovoAgendamento({...novoAgendamento, horario: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Serviço:</label>
            <select
              value={novoAgendamento.servico}
              onChange={(e) => setNovoAgendamento({...novoAgendamento, servico: e.target.value})}
            >
              <option value="corte">Corte</option>
              <option value="barba">Barba</option>
              <option value="corte-barba">Corte + Barba</option>
              <option value="sobrancelha">Sobrancelha</option>
            </select>
          </div>
          <button onClick={agendarServico} className="btn-primary">
            Agendar
          </button>
        </div>

        <div className="meus-agendamentos">
          <h2>Meus Agendamentos</h2>
          {agendamentos.length === 0 ? (
            <p className="no-appointments">Você não possui agendamentos.</p>
          ) : (
            <div className="agendamentos-list">
              {agendamentos.map(agendamento => (
                <div key={agendamento._id} className="agendamento-card">
                  <div className="agendamento-info">
                    <h3>{agendamento.servico}</h3>
                    <p><strong>Data:</strong> {new Date(agendamento.data).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Horário:</strong> {agendamento.horario}</p>
                    <p><strong>Barbeiro:</strong> {agendamento.barbeiro?.nome || 'A definir'}</p>
                    <span className={`status ${agendamento.status.toLowerCase()}`}>
                      {agendamento.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => cancelarAgendamento(agendamento._id)}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClienteDashboard;