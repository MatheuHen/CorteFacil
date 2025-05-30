# CorteFácil - Sistema de Agendamento para Barbearia

## Objetivo do Sistema
O CorteFácil é uma plataforma web que facilita o agendamento de serviços de barbearia, permitindo que clientes agendem horários e barbeiros gerenciem seus atendimentos de forma eficiente.

## Funcionalidades Principais
- Autenticação de usuários (clientes e barbeiros)
- Agendamento de serviços
- Dashboard do cliente com histórico de agendamentos
- Dashboard do barbeiro com controle de agenda
- Gerenciamento de horários de funcionamento
- Controle de status dos agendamentos (pendente, confirmado, finalizado, cancelado)

## Tecnologias Utilizadas
### Frontend
- React.js
- Material-UI para interface
- Axios para comunicação com API
- JWT para autenticação

### Backend
- Node.js
- Express.js
- MongoDB Atlas (Banco de dados)
- JWT para autenticação

## Instalação e Execução

### Pré-requisitos
- Node.js v14 ou superior
- NPM ou Yarn
- MongoDB Atlas (conta e cluster configurados)

### Backend
1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (.env):
```
DB_URI=sua_uri_do_mongodb
JWT_SECRET=seu_segredo_jwt
PORT=3001
```

4. Execute o servidor:
```bash
npm run dev
```

### Frontend
1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o frontend:
```bash
npm start
```

## Estimativas de Custo e Esforço

### Desenvolvimento
- Frontend: 80 horas
- Backend: 60 horas
- Testes e Ajustes: 40 horas
- Total: 180 horas

### Custos (Estimativa)
- Desenvolvedor Frontend: R$ 80/hora
- Desenvolvedor Backend: R$ 90/hora
- Custos de Infraestrutura: R$ 100/mês
- Custo Total Estimado: R$ 15.700

## Ambiente de Produção
- Frontend: Netlify/Vercel
- Backend: Heroku
- Banco de Dados: MongoDB Atlas
- URL de Produção: https://cortefacil-chat-6b9c1276ad86.herokuapp.com/

## Equipe
- Desenvolvedor Full-stack
- UX/UI Designer
- Gerente de Projeto

## Links Úteis
- [Backlog do Projeto](link_do_trello)
- [Documentação da API](link_da_documentacao)
- [Protótipos de Interface](link_dos_prototipos)

---

## Justificativa da Stack

- **React** foi escolhido pela sua flexibilidade e componentização, facilitando a manutenção do frontend.
- **Node.js com Express** permite uma construção rápida e eficiente da API REST.
- **MongoDB** oferece um banco de dados ágil, ideal para projetos em desenvolvimento contínuo.
- **Git + GitHub** garantem controle das mudanças, colaboração e histórico do projeto.
- **Postman** auxilia nos testes de rotas antes da integração.



