import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  // URL da API do Heroku
  const API_URL = process.env.REACT_APP_API_URL || 'https://cortefacil-chat-6b9c1276ad86.herokuapp.com/api';

  const fazerLogin = async () => {
    try {
      setLoading(true);
      setMensagem('');

      const resposta = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem(`✅ ${dados.mensagem}`);
        // Armazena o token no localStorage
        if (dados.token) {
          localStorage.setItem('token', dados.token);
        }
        // Redireciona após login bem-sucedido
        window.location.href = '/dashboard';
      } else {
        setMensagem(`❌ ${dados.erro || 'Erro ao fazer login'}`);
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setMensagem('❌ Erro na conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', padding: '20px' }}>
      <h2>Login - CorteFácil</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ 
            padding: '10px',
            marginBottom: '10px',
            width: '100%',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          style={{ 
            padding: '10px',
            marginBottom: '10px',
            width: '100%',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        <button 
          onClick={fazerLogin} 
          disabled={loading}
          style={{ 
            padding: '10px',
            width: '100%',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
      {mensagem && (
        <p style={{ 
          marginTop: '20px',
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: mensagem.includes('✅') ? '#d4edda' : '#f8d7da',
          color: mensagem.includes('✅') ? '#155724' : '#721c24'
        }}>
          {mensagem}
        </p>
      )}
    </div>
  );
}

export default Login;
