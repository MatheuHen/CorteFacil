# Guia de Deploy - CorteFácil

Este guia explica como configurar e fazer deploy da aplicação CorteFácil nos diferentes ambientes.

## Ambientes

### 1. **Local (Desenvolvimento)**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3333
- **Banco**: MongoDB local

### 2. **Homologação**
- **Frontend**: https://cortefacil-chat.vercel.app
- **Backend**: https://cortefacil-chat-6b9c1276ad86.herokuapp.com
- **Banco**: MongoDB Atlas (homologação)

### 3. **Produção**
- **Frontend**: https://corte-facil.vercel.app
- **Backend**: https://cortefacil-app.herokuapp.com
- **Banco**: MongoDB Atlas (produção)

## Configuração dos Ambientes

### Backend

#### Variáveis de Ambiente
Crie arquivos `.env` específicos para cada ambiente:

**Desenvolvimento (.env)**
```env
NODE_ENV=development
PORT=3333
DB_URI=mongodb://localhost:27017/cortefacil
JWT_SECRET=cortefacil_secret_key_2023
FRONTEND_URL=http://localhost:3000
```

**Homologação (Heroku Config Vars)**
```env
NODE_ENV=staging
PORT=80
DB_URI=mongodb+srv://usuario:senha@cluster-homolog.mongodb.net/cortefacil-homolog
JWT_SECRET=cortefacil_secret_key_homolog_2023
FRONTEND_URL=https://cortefacil-chat.vercel.app
```

**Produção (Heroku Config Vars)**
```env
NODE_ENV=production
PORT=80
DB_URI=mongodb+srv://usuario:senha@cluster-prod.mongodb.net/cortefacil
JWT_SECRET=cortefacil_secret_key_prod_2023
FRONTEND_URL=https://corte-facil.vercel.app
```

### Frontend

#### Arquivos de Configuração

**Desenvolvimento (.env.local)**
```env
REACT_APP_API_URL=http://localhost:3333/api
NODE_ENV=development
```

**Homologação (.env.staging)**
```env
REACT_APP_API_URL=https://cortefacil-chat-6b9c1276ad86.herokuapp.com/api
NODE_ENV=staging
```

**Produção (.env.production)**
```env
REACT_APP_API_URL=https://cortefacil-app.herokuapp.com/api
NODE_ENV=production
```

## Deploy

### 1. Deploy do Backend (Heroku)

#### Homologação
```bash
# Conectar ao app de homologação
heroku git:remote -a cortefacil-chat

# Configurar variáveis de ambiente
heroku config:set NODE_ENV=staging
heroku config:set DB_URI=sua_string_mongodb_homolog
heroku config:set JWT_SECRET=sua_chave_secreta_homolog
heroku config:set FRONTEND_URL=https://cortefacil-chat.vercel.app

# Deploy
git push heroku main
```

#### Produção
```bash
# Conectar ao app de produção
heroku git:remote -a cortefacil-app

# Configurar variáveis de ambiente
heroku config:set NODE_ENV=production
heroku config:set DB_URI=sua_string_mongodb_producao
heroku config:set JWT_SECRET=sua_chave_secreta_producao
heroku config:set FRONTEND_URL=https://corte-facil.vercel.app

# Deploy
git push heroku main
```

### 2. Deploy do Frontend (Vercel)

#### Homologação
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy para homologação
cd frontend
vercel --prod --local-config vercel.staging.json
```

#### Produção
```bash
# Deploy para produção
cd frontend
vercel --prod
```

### 3. Configuração no Vercel Dashboard

#### Para Homologação (cortefacil-chat)
- **Environment Variables**:
  - `REACT_APP_API_URL`: `https://cortefacil-chat-6b9c1276ad86.herokuapp.com/api`
  - `NODE_ENV`: `staging`

#### Para Produção (corte-facil)
- **Environment Variables**:
  - `REACT_APP_API_URL`: `https://cortefacil-app.herokuapp.com/api`
  - `NODE_ENV`: `production`

## Scripts Úteis

### Frontend
```bash
# Desenvolvimento
npm start

# Build para homologação
npm run build:staging

# Build para produção
npm run build:production
```

### Backend
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Checklist de Deploy

### Antes do Deploy
- [ ] Testar localmente
- [ ] Configurar variáveis de ambiente
- [ ] Verificar conexão com banco de dados
- [ ] Testar CORS entre frontend e backend

### Após o Deploy
- [ ] Verificar se a API está respondendo
- [ ] Testar login/cadastro
- [ ] Verificar logs de erro
- [ ] Testar funcionalidades principais

## Troubleshooting

### Problemas Comuns

1. **CORS Error**
   - Verificar se a URL do frontend está nas `allowedOrigins` do backend
   - Conferir variável `FRONTEND_URL` no Heroku

2. **Database Connection Error**
   - Verificar string de conexão MongoDB
   - Confirmar IP whitelist no MongoDB Atlas

3. **Environment Variables**
   - Verificar se todas as variáveis estão configuradas
   - Reiniciar aplicação após mudanças

## Monitoramento

### Logs
```bash
# Heroku logs
heroku logs --tail -a cortefacil-app
heroku logs --tail -a cortefacil-chat

# Vercel logs
vercel logs
```

### Health Check
- **Backend**: `GET /` - Retorna status da API
- **Frontend**: Verificar se carrega corretamente