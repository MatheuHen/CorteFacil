import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import './BarbeiroDashboard.css';

function BarbeiroDashboard() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [horarios, setHorarios] = useState({
    segunda: { inicio: '08:00', fim: '18:00', ativo: true },
    terca: { inicio: '08:00', fim: '18:00', ativo: true },
    quarta: { inicio: '08:00', fim: '18:00', ativo: true },
    quinta: { inicio: '08:00', fim: '18:00', ativo: true },
    sexta: { inicio: '08:00', fim: '18:00', ativo: true },
    sabado: { inicio: '08:00', fim: '16:00', ativo: true },
    domingo: { inicio: '08:00', fim: '12:00', ativo: false }
  });
  const [estatisticas, setEstatisticas] = useState({
    agendamentosHoje: 0,
    faturamentoMes: 0,
    clientesAtendidos: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tipoPerfil = localStorage.getItem('tipoPerfil');
    
    if (!token || tipoPerfil !== 'barbeiro') {
      navigate('/login');
      return;
    }
    
    carregarDados();
  }, [navigate]);

  const carregarDados = async () => {
    try {
      const [agendamentosRes, horariosRes, estatisticasRes] = await Promise.all([
        api.get('/api/agendamentos/barbeiro'),
        api.get('/api/barbeiros/horarios'),
        api.get('/api/barbeiros/estatisticas')
      ]);

      setAgendamentos(agendamentosRes.data);
      if (horariosRes.data) setHorarios(horariosRes.data);
      setEstatisticas(estatisticasRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados. Por favor, tente novamente.');
    }
  };

  const confirmarAgendamento = async (id) => {
    try {
      await api.put(`/api/agendamentos/${id}/confirmar`);
      setAgendamentos(agendamentos.map(ag => 
        ag._id === id ? { ...ag, status: 'Confirmado' } : ag
      ));
      alert('Agendamento confirmado com sucesso!');
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      alert('Erro ao confirmar agendamento. Por favor, tente novamente.');
    }
  };

  const cancelarAgendamento = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        await api.put(`/api/agendamentos/${id}/cancelar`);
        setAgendamentos(agendamentos.map(ag => 
          ag._id === id ? { ...ag, status: 'Cancelado' } : ag
        ));
        alert('Agendamento cancelado com sucesso!');
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        alert('Erro ao cancelar agendamento. Por favor, tente novamente.');
      }
    }
  };

  const finalizarAtendimento = async (id) => {
    try {
      await api.put(`/api/agendamentos/${id}/finalizar`);
      setAgendamentos(agendamentos.map(ag => 
        ag._id === id ? { ...ag, status: 'Finalizado' } : ag
      ));
      alert('Atendimento finalizado com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
      alert('Erro ao finalizar atendimento. Por favor, tente novamente.');
    }
  };

  const salvarHorarios = async () => {
    try {
      await api.put('/api/barbeiros/horarios', horarios);
      alert('Horários de funcionamento atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      alert('Erro ao salvar horários. Por favor, tente novamente.');
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

  const diasSemana = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  return (
    <div className="barbeiro-dashboard">
      <header className="dashboard-header">
        <h1>Dashboard do Barbeiro</h1>
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
        {/* Estatísticas */}
        <div className="estatisticas">
          <div className="stat-card">
            <h3>Agendamentos Hoje</h3>
            <span className="stat-number">{estatisticas.agendamentosHoje}</span>
          </div>
          <div className="stat-card">
            <h3>Faturamento do Mês</h3>
            <span className="stat-number">R$ {estatisticas.faturamentoMes.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <h3>Clientes Atendidos</h3>
            <span className="stat-number">{estatisticas.clientesAtendidos}</span>
          </div>
        </div>

        <div className="main-content">
          {/* Agendamentos */}
          <div className="agendamentos-section">
            <h2>Agendamentos</h2>
            {agendamentos.length === 0 ? (
              <p className="no-appointments">Nenhum agendamento encontrado.</p>
            ) : (
              <div className="agendamentos-list">
                {agendamentos.map(agendamento => (
                  <div key={agendamento._id} className="agendamento-card">
                    <div className="agendamento-info">
                      <h3>{agendamento.cliente?.nome || 'Cliente'}</h3>
                      <p><strong>Serviço:</strong> {agendamento.servico}</p>
                      <p><strong>Data:</strong> {new Date(agendamento.data).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Horário:</strong> {agendamento.horario}</p>
                      <p><strong>Valor:</strong> R$ {agendamento.valor?.toFixed(2) || '0.00'}</p>
                      <span className={`status ${agendamento.status.toLowerCase()}`}>
                        {agendamento.status}
                      </span>
                    </div>
                    <div className="agendamento-actions">
                      {agendamento.status === 'Pendente' && (
                        <button 
                          onClick={() => confirmarAgendamento(agendamento._id)}
                          className="btn-confirm"
                        >
                          Confirmar
                        </button>
                      )}
                      {agendamento.status === 'Confirmado' && (
                        <button 
                          onClick={() => finalizarAtendimento(agendamento._id)}
                          className="btn-finish"
                        >
                          Finalizar
                        </button>
                      )}
                      {agendamento.status !== 'Finalizado' && agendamento.status !== 'Cancelado' && (
                        <button 
                          onClick={() => cancelarAgendamento(agendamento._id)}
                          className="btn-cancel"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Horários de Funcionamento */}
          <div className="horarios-section">
            <h2>Horários de Funcionamento</h2>
            <div className="horarios-form">
              {Object.entries(horarios).map(([dia, config]) => (
                <div key={dia} className="horario-dia">
                  <div className="dia-header">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.ativo}
                        onChange={(e) => setHorarios({
                          ...horarios,
                          [dia]: { ...config, ativo: e.target.checked }
                        })}
                      />
                      <span>{diasSemana[dia]}</span>
                    </label>
                  </div>
                  {config.ativo && (
                    <div className="horario-inputs">
                      <input
                        type="time"
                        value={config.inicio}
                        onChange={(e) => setHorarios({
                          ...horarios,
                          [dia]: { ...config, inicio: e.target.value }
                        })}
                      />
                      <span>às</span>
                      <input
                        type="time"
                        value={config.fim}
                        onChange={(e) => setHorarios({
                          ...horarios,
                          [dia]: { ...config, fim: e.target.value }
                        })}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button onClick={salvarHorarios} className="btn-save">
                Salvar Horários
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarbeiroDashboard;