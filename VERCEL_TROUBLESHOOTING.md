# 🔧 Guia de Troubleshooting - Vercel Deploy

## Códigos de Erro Comuns do Vercel

Este guia ajuda a identificar e resolver erros comuns durante o deploy no Vercel.

## 🚨 Erros de Aplicação

### Erros de Função (5xx)

| Código de Erro | Status HTTP | Descrição | Solução |
|---|---|---|---|
| `FUNCTION_INVOCATION_FAILED` | 500 | Falha na execução da função | Verificar logs da função, corrigir código |
| `FUNCTION_INVOCATION_TIMEOUT` | 504 | Timeout na execução | Otimizar performance, reduzir tempo de execução |
| `FUNCTION_PAYLOAD_TOO_LARGE` | 413 | Payload muito grande | Reduzir tamanho dos dados enviados |
| `FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE` | 500 | Resposta muito grande | Paginar dados, reduzir resposta |
| `FUNCTION_THROTTLED` | 503 | Função limitada por rate limit | Aguardar ou otimizar uso |
| `NO_RESPONSE_FROM_FUNCTION` | 502 | Função não respondeu | Verificar se função está retornando resposta |

### Erros de Middleware

| Código de Erro | Status HTTP | Descrição | Solução |
|---|---|---|---|
| `MIDDLEWARE_INVOCATION_FAILED` | 500 | Falha no middleware | Verificar configuração do middleware |
| `MIDDLEWARE_INVOCATION_TIMEOUT` | 504 | Timeout no middleware | Otimizar middleware |
| `EDGE_FUNCTION_INVOCATION_FAILED` | 500 | Falha na Edge Function | Verificar código da Edge Function |
| `EDGE_FUNCTION_INVOCATION_TIMEOUT` | 504 | Timeout na Edge Function | Otimizar Edge Function |

### Erros de Deploy

| Código de Erro | Status HTTP | Descrição | Solução |
|---|---|---|---|
| `DEPLOYMENT_BLOCKED` | 403 | Deploy bloqueado | Verificar permissões, plano Vercel |
| `DEPLOYMENT_PAUSED` | 503 | Deploy pausado | Reativar deploy no dashboard |
| `DEPLOYMENT_DISABLED` | 402 | Deploy desabilitado | Verificar pagamento, plano |
| `DEPLOYMENT_NOT_FOUND` | 404 | Deploy não encontrado | Verificar URL, fazer novo deploy |
| `DEPLOYMENT_NOT_READY_REDIRECTING` | 303 | Deploy ainda processando | Aguardar conclusão |
| `DEPLOYMENT_DELETED` | 410 | Deploy foi deletado | Fazer novo deploy |

## 🌐 Erros de Roteamento

### Erros de DNS

| Código de Erro | Status HTTP | Descrição | Solução |
|---|---|---|---|
| `DNS_HOSTNAME_NOT_FOUND` | 502 | Hostname não encontrado | Verificar configuração de domínio |
| `DNS_HOSTNAME_RESOLVE_FAILED` | 502 | Falha na resolução DNS | Aguardar propagação DNS |
| `DNS_HOSTNAME_RESOLVED_PRIVATE` | 404 | IP privado resolvido | Verificar configuração de rede |

### Erros de Roteamento

| Código de Erro | Status HTTP | Descrição | Solução |
|---|---|---|---|
| `ROUTER_CANNOT_MATCH` | 502 | Rota não encontrada | Verificar configuração de rotas |
| `ROUTER_EXTERNAL_TARGET_ERROR` | 502 | Erro no destino externo | Verificar serviço externo |
| `TOO_MANY_FORKS` | 502 | Muitas bifurcações | Simplificar lógica de roteamento |

## 📝 Erros de Requisição

| Código de Erro | Status HTTP | Descrição | Solução |
|---|---|---|---|
| `INVALID_REQUEST_METHOD` | 405 | Método HTTP inválido | Usar método correto (GET, POST, etc.) |
| `MALFORMED_REQUEST_HEADER` | 400 | Header malformado | Corrigir headers da requisição |
| `REQUEST_HEADER_TOO_LARGE` | 431 | Header muito grande | Reduzir tamanho dos headers |
| `URL_TOO_LONG` | 414 | URL muito longa | Encurtar URL ou usar POST |
| `RESOURCE_NOT_FOUND` | 404 | Recurso não encontrado | Verificar caminho do arquivo |

## 🖼️ Erros de Imagem

| Código de Erro | Status HTTP | Descrição | Solução |
|---|---|---|---|
| `INVALID_IMAGE_OPTIMIZE_REQUEST` | 400 | Requisição de otimização inválida | Verificar parâmetros de imagem |
| `OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED` | 502 | Falha ao otimizar imagem externa | Verificar URL da imagem |

## 🔧 Soluções Específicas para CorteFácil

### 1. Erro de Build
```bash
# Se o build falhar, verificar:
npm run build

# Verificar se todas as dependências estão instaladas:
npm install

# Limpar cache:
npm run build -- --reset-cache
```

### 2. Erro de Roteamento (React Router)
```json
// Verificar se vercel.json está configurado corretamente:
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Erro de Variáveis de Ambiente
```bash
# Verificar se as variáveis estão definidas no Vercel:
# Dashboard > Project > Settings > Environment Variables

# Variáveis necessárias:
REACT_APP_API_URL=https://sua-api.herokuapp.com/api
NODE_ENV=production
```

### 4. Erro de API (CORS)
```javascript
// Verificar se o backend permite o domínio do Vercel:
const corsOptions = {
  origin: [
    'https://seu-app.vercel.app',
    'http://localhost:3000'
  ]
};
```

## 📊 Monitoramento e Debug

### Verificar Logs
1. **Vercel Dashboard**: Project > Functions > View Logs
2. **CLI**: `vercel logs [deployment-url]`
3. **Browser DevTools**: Network tab para erros de API

### Comandos Úteis
```bash
# Verificar status do deploy
vercel ls

# Ver logs em tempo real
vercel logs --follow

# Fazer deploy com logs detalhados
vercel --debug

# Testar build localmente
npm run build && npx serve -s build
```

## 🆘 Quando Contatar Suporte

Contate o suporte do Vercel se encontrar erros com prefixo `INTERNAL_`:
- `INTERNAL_UNEXPECTED_ERROR`
- `INTERNAL_FUNCTION_INVOCATION_FAILED`
- `INTERNAL_DEPLOYMENT_FETCH_FAILED`
- Qualquer erro 500 persistente

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Status Page](https://vercel-status.com/)
- [Community Forum](https://github.com/vercel/vercel/discussions)
- [Discord](https://vercel.com/discord)

---

**💡 Dica**: Sempre verifique o [Status Page do Vercel](https://vercel-status.com/) antes de debuggar, pode ser um problema temporário da plataforma.