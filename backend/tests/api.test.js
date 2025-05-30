const request = require('supertest');

describe('Testes de Integração com API Externa', () => {
  const API_URL = 'https://cortefacil-chat-6b9c1276ad86.herokuapp.com';
  const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzlhMWJkYTM2OTRkMmJkZTc1MWJlYSIsInRpcG8iOiJhZG1pbiIsImlhdCI6MTc0ODYwNzQ0NCwiZXhwIjoxNzQ4NjkzODQ0fQ.SVCGWc1PKCFdVciUgH7ABFOHF5TRosIrqVljNPfhve4';

  // Teste de cadastro de usuário
  it('Deve cadastrar um novo usuário', async () => {
    const novoUsuario = {
      nome: 'Teste API',
      email: `teste${Date.now()}@teste.com`,
      senha: '123456',
      tipo: 'cliente'
    };

    const response = await request(API_URL)
      .post('/api/usuarios')
      .send(novoUsuario);

    console.log('Resposta do cadastro:', response.body);
    expect(response.status).toBe(201);
  });

  // Teste de login
  it('Deve fazer login com sucesso', async () => {
    const credenciais = {
      email: 'admin@cortefacil.com',
      senha: '123456'
    };

    const response = await request(API_URL)
      .post('/api/usuarios/login')
      .send(credenciais);

    console.log('Resposta do login:', response.body);
    expect(response.status).toBe(200);
  });

  // Teste de listagem de usuários com token
  it('Deve listar usuários com token', async () => {
    const response = await request(API_URL)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${TOKEN}`);

    console.log('Resposta da listagem:', response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.usuarios)).toBe(true);
  });
}); 