const express = require('express');
const { makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const P = require('pino');
const dotenv = require('dotenv');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_DIR = './auth_info_baileys';

app.use(express.json());

let sock;
let isConnected = false;

// Garantir que o diretório de sessão existe
if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
}

// Função para formatar número de telefone
function formatPhoneNumber(number) {
    // Remove todos os caracteres não numéricos
    let cleaned = number.replace(/\D/g, '');
    
    // Adiciona o código do país se não existir
    if (!cleaned.startsWith('55')) {
        cleaned = '55' + cleaned;
    }
    
    // Garante que o número tem pelo menos 12 dígitos (55 + DDD + número)
    if (cleaned.length < 12) {
        throw new Error('Número de telefone inválido');
    }
    
    return cleaned + '@s.whatsapp.net';
}

// Função para verificar número com retry
async function checkNumberWithRetry(formattedNumber, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = await sock.onWhatsApp(formattedNumber);
            return result;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

// Inicializar WhatsApp Socket
async function initializeWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

        // Usar a variável global sock
        sock = makeWASocket({
            printQRInTerminal: true,
            logger: P({ level: 'warn' }),
            browser: ['WhatsApp Check API', 'Chrome', '1.0.0'],
            connectTimeoutMs: 60_000,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })),
            },
            defaultQueryTimeoutMs: 20_000,
            emitOwnEvents: true,
            retryRequestDelayMs: 500,
            qrTimeout: 40_000
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('📱 Escaneie o QR Code abaixo para conectar ao WhatsApp:');
                qrcode.generate(qr, { small: true });
            }

            if (connection === 'close') {
                isConnected = false;
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('Conexão com WhatsApp fechada devido a:', lastDisconnect?.error);
                
                if (shouldReconnect) {
                    console.log('Reconectando...');
                    setTimeout(initializeWhatsApp, 3000);
                } else {
                    console.log('Desconectado permanentemente, deletando sessão...');
                    try {
                        fs.rmSync(SESSION_DIR, { recursive: true, force: true });
                        setTimeout(initializeWhatsApp, 3000);
                    } catch (err) {
                        console.error('Erro ao deletar sessão:', err);
                    }
                }
            } else if (connection === 'open') {
                isConnected = true;
                console.log('✅ Conexão com WhatsApp estabelecida!');
            }
        });

    } catch (error) {
        console.error('Erro ao inicializar WhatsApp:', error);
        setTimeout(initializeWhatsApp, 3000);
    }
}

// Rota para verificar número no WhatsApp
app.post('/check-whatsapp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ 
            error: 'Número de telefone é obrigatório.',
            example: "Formato esperado: 5548991196884 ou 48991196884" 
        });
    }

    if (!sock || !isConnected) {
        return res.status(500).json({ 
            error: 'WhatsApp não está conectado.',
            message: 'Aguarde alguns segundos e tente novamente' 
        });
    }

    try {
        // Formata o número e valida
        const formattedNumber = formatPhoneNumber(phoneNumber);
        
        // Verifica o número com retry
        const result = await checkNumberWithRetry(formattedNumber);

        if (result && result[0]) {
            return res.json({
                exists: true,
                phoneNumber: result[0].jid,
                status: 'success'
            });
        } else {
            return res.json({
                exists: false,
                phoneNumber: formattedNumber.split('@')[0],
                status: 'success'
            });
        }
    } catch (error) {
        console.error('Erro ao verificar número:', error);
        
        if (error.message === 'Número de telefone inválido') {
            return res.status(400).json({ 
                error: 'Número de telefone inválido',
                example: "Formato esperado: 5548991196884 ou 48991196884"
            });
        }

        return res.status(500).json({ 
            error: 'Erro ao verificar número no WhatsApp',
            message: 'Tente novamente em alguns segundos'
        });
    }
});

// Iniciar o servidor e o WhatsApp
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    initializeWhatsApp();
});