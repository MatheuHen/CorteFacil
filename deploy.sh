#!/bin/bash

# Script de Deploy - CorteFácil
# Uso: ./deploy.sh [staging|production]

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo "Uso: ./deploy.sh [staging|production]"
    exit 1
fi

echo "🚀 Iniciando deploy para $ENVIRONMENT..."

case $ENVIRONMENT in
    "staging")
        echo " Deploy para HOMOLOGAÇÃO"
        
        # Deploy Backend
        echo " Fazendo deploy do backend..."
        git push heroku-staging main
        
        # Deploy Frontend
        echo " Fazendo deploy do frontend..."
        cd frontend
        vercel --prod --local-config vercel.staging.json
        cd ..
        
        echo "✅ Deploy de homologação concluído!"
        echo "🌐 Frontend: https://cortefacil-chat.vercel.app"
        echo "🔗 Backend: https://cortefacil-chat-6b9c1276ad86.herokuapp.com"
        ;;
        
    "production")
        echo "📦 Deploy para PRODUÇÃO"
        
        # Deploy Backend
        echo "🔧 Fazendo deploy do backend..."
        git push heroku-production main
        
        # Deploy Frontend
        echo "🎨 Fazendo deploy do frontend..."
        cd frontend
        vercel --prod
        cd ..
        
        echo "✅ Deploy de produção concluído!"
        echo "🌐 Frontend: https://corte-facil.vercel.app"
        echo "🔗 Backend: https://cortefacil-app.herokuapp.com"
        ;;
        
    *)
        echo "❌ Ambiente inválido. Use 'staging' ou 'production'"
        exit 1
        ;;
esac

echo "🎉 Deploy finalizado com sucesso!"