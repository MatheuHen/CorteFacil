# Deploy no Vercel - CorteFacil

## Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Repositório no GitHub/GitLab/Bitbucket

## Passos para Deploy

### 1. Preparar o Repositório

```bash
# Adicionar arquivos ao git
git add .
git commit -m "Preparar para deploy no Vercel"
git push origin main
```

### 2. Configurar no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure as seguintes opções:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`

### 3. Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no painel do Vercel:

```
NODE_OPTIONS=--openssl-legacy-provider
REACT_APP_API_URL=https://sua-api-backend.herokuapp.com
```

**Importante**: Substitua `https://sua-api-backend.herokuapp.com` pela URL real do seu backend deployado.

### 4. Deploy Automático

Após a configuração, o Vercel fará deploy automático a cada push para a branch principal.

## Arquivos de Configuração

- `vercel.json`: Configurações de build e rotas
- `.vercelignore`: Arquivos a serem ignorados no deploy
- `package.json` (raiz): Scripts de build para o Vercel

## Troubleshooting

### Erro de OpenSSL
Se houver erros relacionados ao OpenSSL, verifique se a variável `NODE_OPTIONS=--openssl-legacy-provider` está configurada.

### Erro de Build
Verifique os logs de build no painel do Vercel para identificar problemas específicos.

## URLs

- **Frontend**: Será fornecida pelo Vercel após o deploy
- **Backend**: Precisa ser deployado separadamente (Railway, Heroku, etc.)

## Notas Importantes

- Este deploy inclui apenas o frontend React
- O backend Node.js precisa ser deployado em outro serviço
- Lembre-se de atualizar as URLs da API no frontend após deploy do backend