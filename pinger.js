// pinger.js
require('dotenv').config(); // Para carregar variáveis de ambiente, se necessário

const axios = require('axios'); // Vamos usar o Axios para fazer a requisição

// --- CONFIGURAÇÃO IMPORTANTE ---
// Use a URL pública da sua API no Render.com.
// Por exemplo: https://seu-app-pawgestor.onrender.com
const YOUR_API_URL = "https://pawgestorlpb.onrender.com"|| 'http://localhost:3000'; // Substitua pelo link real do Render.com

// Função para fazer a requisição POST
const pingApi = async () => {
    try {
        const response = await axios.post(`${YOUR_API_URL}/`);
        console.log(`[${new Date().toLocaleString()}] Requisição POST para ${YOUR_API_URL}/ enviada. Status: ${response.status} - Data: ${response.data}`);
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Erro ao fazer requisição POST para ${YOUR_API_URL}/: ${error.message}`);
        // Se houver um erro como "ECONNREFUSED" ou "ENOTFOUND", significa que o servidor pode estar dormindo ou a URL está incorreta.
    }
};

// Inicia o "pinger" imediatamente e depois a cada 10 minutos
console.log(`Iniciando o "pinger" para ${YOUR_API_URL}/. Próxima requisição em 10 minutos.`);
pingApi(); // Faz a primeira requisição ao iniciar
setInterval(pingApi, 10 * 60 * 1000); // 10 minutos * 60 segundos * 1000 milissegundos