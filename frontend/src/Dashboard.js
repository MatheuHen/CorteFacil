import React, { useState, useEffect } from 'react';
import { buildApiUrl } from './config';
import './Dashboard.css';

function Dashboard({ usuario: usuarioProp, onLogout }) {
  const [usuario, setUsuario] = useState(usuarioProp);
  const [agendamentos, setAgendamentos] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    data: '',
    horario: '',
    servico: 'Corte de cabelo',
    barbeiro: '',
    observacoes: ''
  });
  const [barbeiros] = useState([
    { id: 1, nome: 'Carlos Santos' },
    { id: 2, nome: 'Pedro Lima' },
    { id: 3, nome: 'João Silva' },
    { id: 4, nome: 'Roberto Costa' }
  ]);
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [carregandoAgendamento, setCarregandoAgendamento] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  useEffect(() => {
    // Usar dados do usuário passados como prop ou simular
    if (usuarioProp) {
      setUsuario(usuarioProp);
    } else {
      const dadosUsuario = {
        nome: 'João Silva',
        email: 'joao@email.com',
        tipo: 'cliente'
      };
      setUsuario(dadosUsuario);
    }

    // Simular agendamentos existentes
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const proximaSemana = new Date(hoje);
    proximaSemana.setDate(hoje.getDate() + 7);
    
    const agendamentosSimulados = [
      {
        id: 1,
        data: amanha.toISOString().split('T')[0],
        horario: '14:00',
        servico: 'Corte de cabelo',
        barbeiro: 'Carlos Santos',
        status: 'confirmado'
      },
      {
        id: 2,
        data: proximaSemana.toISOString().split('T')[0],
        horario: '16:30',
        servico: 'Corte + Barba',
        barbeiro: 'Pedro Lima',
        status: 'agendado'
      }
    ];
    setAgendamentos(agendamentosSimulados);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'barbeiro') {
      // Para barbeiro, salvar o objeto completo
      const barbeiroSelecionado = barbeiros.find(b => b.id.toString() === value);
      setNovoAgendamento(prev => ({
        ...prev,
        [name]: barbeiroSelecionado || ''
      }));
    } else {
      setNovoAgendamento(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Se mudou a data, buscar horários disponíveis
    if (name === 'data' && value) {
      buscarHorariosDisponiveis(value);
    }
  };

  const buscarHorariosDisponiveis = async (data) => {
    try {
      setCarregandoHorarios(true);
      const response = await fetch(buildApiUrl(`/api/usuarios/horarios-disponiveis?data=${data}`));
      const resultado = await response.json();
      
      if (response.ok) {
        setHorariosDisponiveis(resultado.horariosDisponiveis);
      } else {
        setMensagem(resultado.erro || 'Erro ao buscar horários disponíveis');
        setTipoMensagem('erro');
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor');
      setTipoMensagem('erro');
    } finally {
      setCarregandoHorarios(false);
    }
  };

  const carregarAgendamentos = async () => {
    try {
      const response = await fetch(buildApiUrl(`/api/usuarios/agendamentos/${usuarioProp.id}`));
      const resultado = await response.json();
      
      if (response.ok) {
        setAgendamentos(resultado.agendamentos);
      } else {
        setMensagem(resultado.erro || 'Erro ao carregar agendamentos');
        setTipoMensagem('erro');
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor');
      setTipoMensagem('erro');
    }
  };

  const remarcarAgendamento = (agendamento) => {
    setAgendamentoEditando(agendamento);
    setNovoAgendamento({
      data: agendamento.data,
      horario: agendamento.horario,
      servico: agendamento.servico,
      barbeiro: agendamento.barbeiro,
      observacoes: agendamento.observacoes || ''
    });
  };

  const cancelarEdicao = () => {
    setAgendamentoEditando(null);
    setNovoAgendamento({
      data: '',
      horario: '',
      servico: 'Corte de cabelo',
      barbeiro: '',
      observacoes: ''
    });
  };

  const validarHorarioMinimo = () => {
    const agora = new Date();
    const dataAgendamento = new Date(`${novoAgendamento.data}T${novoAgendamento.horario}:00`);
    
    // Verificar se a data é válida
    if (isNaN(dataAgendamento.getTime())) {
      return false;
    }
    
    // Calcular diferença em minutos para maior precisão
    const diferencaMinutos = (dataAgendamento - agora) / (1000 * 60);
    
    // Permitir agendamentos com pelo menos 60 minutos de antecedência
    return diferencaMinutos >= 60;
  };

  const verificarConflito = () => {
    return agendamentos.some(ag => 
      ag.data === novoAgendamento.data && 
      ag.horario === novoAgendamento.horario && 
      ag.barbeiro === novoAgendamento.barbeiro &&
      ag.status !== 'cancelado' &&
      (!agendamentoEditando || ag.id !== agendamentoEditando.id)
    );
  };

  const criarAgendamento = async () => {
    if (!novoAgendamento.data || !novoAgendamento.horario || !novoAgendamento.servico || !novoAgendamento.barbeiro) {
      setMensagem('Por favor, preencha todos os campos obrigatórios.');
      setTipoMensagem('erro');
      return;
    }

    if (!validarHorarioMinimo()) {
      setMensagem('O agendamento deve ser feito com pelo menos 1 hora de antecedência.');
      setTipoMensagem('erro');
      return;
    }

    if (verificarConflito()) {
      setMensagem('Este horário já está ocupado com o barbeiro selecionado.');
      setTipoMensagem('erro');
      return;
    }

    try {
      setCarregandoAgendamento(true);
      const response = await fetch(buildApiUrl('/api/usuarios/agendamentos'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteId: usuarioProp.id,
          data: novoAgendamento.data,
          horario: novoAgendamento.horario,
          servico: novoAgendamento.servico,
          barbeiro: novoAgendamento.barbeiro,
          observacoes: novoAgendamento.observacoes
        })
      });

      const resultado = await response.json();

      if (response.ok) {
        setMensagem(resultado.mensagem);
        setTipoMensagem('sucesso');
        setNovoAgendamento({
          data: '',
          horario: '',
          servico: 'Corte de cabelo',
          barbeiro: '',
          observacoes: ''
        });
        setAgendamentoEditando(null);
        setHorariosDisponiveis([]);
        // Recarregar agendamentos
        carregarAgendamentos();
      } else {
        setMensagem(resultado.erro || 'Erro ao criar agendamento');
        setTipoMensagem('erro');
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor');
      setTipoMensagem('erro');
    } finally {
      setCarregandoAgendamento(false);
    }
  };

  const cancelarAgendamento = async (agendamentoId) => {
    try {
      const response = await fetch(buildApiUrl(`/api/usuarios/agendamentos/${agendamentoId}/cancelar`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteId: usuarioProp.id
        })
      });

      const resultado = await response.json();

      if (response.ok) {
        setMensagem(resultado.mensagem);
        setTipoMensagem('sucesso');
        // Recarregar agendamentos
        carregarAgendamentos();
      } else {
        setMensagem(resultado.erro || 'Erro ao cancelar agendamento');
        setTipoMensagem('erro');
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor');
      setTipoMensagem('erro');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  // Carregar agendamentos ao montar o componente
  React.useEffect(() => {
    if (usuarioProp && usuarioProp.id) {
      carregarAgendamentos();
    }
  }, [usuarioProp]);

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">CorteFácil</h1>
          <div className="user-info">
            <span>Olá, {usuario.nome}!</span>
            <button onClick={logout} className="btn btn-secondary logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Seção de Novo Agendamento */}
          <section className="card novo-agendamento">
            <h2 className="section-title">{agendamentoEditando ? 'Remarcar Agendamento' : 'Novo Agendamento'}</h2>
            {agendamentoEditando && (
              <div className="editing-notice">
                <p>Editando agendamento de {new Date(agendamentoEditando.data).toLocaleDateString('pt-BR')} às {agendamentoEditando.horario}</p>
                <button onClick={cancelarEdicao} className="btn btn-secondary btn-small">Cancelar Edição</button>
              </div>
            )}
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="data" className="input-label">Data</label>
                <input
                  id="data"
                  type="date"
                  name="data"
                  value={novoAgendamento.data}
                  onChange={handleInputChange}
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="barbeiro" className="input-label">Barbeiro</label>
                <select
                  id="barbeiro"
                  name="barbeiro"
                  value={novoAgendamento.barbeiro?.id || ''}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Selecione um barbeiro</option>
                  {barbeiros.map(barbeiro => (
                    <option key={barbeiro.id} value={barbeiro.id}>{barbeiro.nome}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="horario" className="input-label">Horário</label>
                <select
                  id="horario"
                  name="horario"
                  value={novoAgendamento.horario}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!novoAgendamento.data || carregandoHorarios}
                >
                  <option value="">
                    {carregandoHorarios ? 'Carregando horários...' : 'Selecione um horário'}
                  </option>
                  {horariosDisponiveis.map(horario => (
                    <option key={horario} value={horario}>{horario}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="servico" className="input-label">Serviço</label>
                <select
                  id="servico"
                  name="servico"
                  value={novoAgendamento.servico}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="Corte de cabelo">Corte de cabelo - R$ 25,00</option>
                  <option value="Barba">Barba - R$ 15,00</option>
                  <option value="Corte + Barba">Corte + Barba - R$ 35,00</option>
                  <option value="Sobrancelha">Sobrancelha - R$ 10,00</option>
                  <option value="Bigode">Bigode - R$ 8,00</option>
                  <option value="Lavagem">Lavagem - R$ 12,00</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="observacoes" className="input-label">Observações (opcional)</label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={novoAgendamento.observacoes}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Alguma observação especial?"
                  rows="3"
                />
              </div>
            </div>
            
            <button 
              onClick={criarAgendamento}
              className="btn btn-primary"
              disabled={carregandoAgendamento}
            >
              {carregandoAgendamento ? (agendamentoEditando ? 'Remarcando...' : 'Agendando...') : (agendamentoEditando ? 'Remarcar' : 'Agendar')}
            </button>
            
            {mensagem && (
              <div className={`mensagem mensagem-${tipoMensagem}`}>
                {mensagem}
              </div>
            )}
          </section>

          {/* Seção de Agendamentos */}
          <section className="card agendamentos-lista">
            <h2 className="section-title">Meus Agendamentos</h2>
            {agendamentos.length === 0 ? (
              <p className="empty-state">Você não possui agendamentos.</p>
            ) : (
              <div className="agendamentos-grid">
                {agendamentos.map(agendamento => {
                  // Corrigir formatação da data para evitar Invalid Date
                  let dataFormatada = 'Data inválida';
                  try {
                    if (agendamento.data) {
                      // Se a data já está no formato YYYY-MM-DD, usar diretamente
                      const [ano, mes, dia] = agendamento.data.split('-');
                      if (ano && mes && dia) {
                        const dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
                        dataFormatada = dataObj.toLocaleDateString('pt-BR');
                      }
                    }
                  } catch (error) {
                    console.error('Erro ao formatar data:', error);
                  }
                  
                  return (
                    <div className={`agendamento-item agendamento-${agendamento.status}`} key={agendamento.id}>
                      <div className="agendamento-header">
                        <div className="agendamento-data-hora">
                          <span className="data">{dataFormatada}</span>
                          <span className="horario">{agendamento.horario}</span>
                        </div>
                        <span className={`status status-${agendamento.status}`}>
                          {agendamento.status === 'agendado' ? 'Agendado' : 
                           agendamento.status === 'confirmado' ? 'Confirmado' : 
                           agendamento.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                        </span>
                      </div>
                      
                      <div className="agendamento-detalhes">
                        <div className="agendamento-info">
                          <div className="info-row">
                            <p><strong>📅 Data:</strong> {dataFormatada}</p>
                            <p><strong>🕐 Horário:</strong> {agendamento.horario}</p>
                          </div>
                          <div className="info-row">
                            <p><strong>✂️ Serviço:</strong> {agendamento.servico}</p>
                            <p><strong>👨‍💼 Barbeiro:</strong> {agendamento.barbeiro || agendamento.barbeiroNome || 'A definir'}</p>
                          </div>
                        </div>
                        {agendamento.observacoes && (
                          <p className="observacoes"><strong>📝 Observações:</strong> {agendamento.observacoes}</p>
                        )}
                      </div>
                      
                      {agendamento.status === 'agendado' && (
                        <div className="agendamento-acoes">
                          <button 
                            onClick={() => remarcarAgendamento(agendamento)}
                            className="btn btn-primary btn-small"
                          >
                            📅 Remarcar
                          </button>
                          <button 
                            onClick={() => cancelarAgendamento(agendamento.id)}
                            className="btn btn-secondary btn-small"
                          >
                            ❌ Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;