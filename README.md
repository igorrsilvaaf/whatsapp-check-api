## 📚 **WhatsApp Number Validation API**

**Uma API desenvolvida para validar números do WhatsApp usando o Baileys.**  
Essa API permite verificar se um número de telefone está registrado no WhatsApp, retornando informações úteis para sistemas de automação, suporte ao cliente, entre outros.

---

## 🚀 **Índice**

- [📚 Descrição](#-descrição)  
- [🛠️ Pré-requisitos](#-pré-requisitos)  
- [💻 Instalação](#-instalação)  
- [⚙️ Configuração](#-configuração)  
- [▶️ Execução](#️-Execução)  
- [📤 Endpoints](#-endpoints)  
- [📊 Exemplo de Uso](#-exemplo-de-uso)  
- [🛡️ Boas Práticas](#️-boas-práticas)  
- [🐞 Solução de Problemas](#-solução-de-problemas)  
- [👥 Contribuição](#-contribuição)  
- [📄 Licença](#-licença)

---

## 📚 **Descrição**

A **WhatsApp Number Validation API** utiliza a biblioteca **Baileys** para conectar-se ao WhatsApp e validar números diretamente pela plataforma.  

### 📝 **Principais Funcionalidades**
- Validação de números do WhatsApp.  
- Conexão estável com reconexão automática.  
- Logs detalhados para monitoramento.  
- Estrutura escalável para integração com outros serviços.

---

## 🛠️ **Pré-requisitos**

Antes de iniciar, você precisa ter as seguintes ferramentas instaladas:

- **Node.js** (Versão 18 ou superior)  
- **NPM** (ou Yarn, caso prefira)  
- **Git**  
- **WhatsApp instalado em um dispositivo móvel**  
- **Postman** (Opcional, para testar os endpoints)

---

## 💻 **Instalação**

### 1️⃣ **Clone o Repositório**

```bash
git clone https://github.com/seu-usuario/whatsapp-check-api.git
cd whatsapp-check-api
```

### 2️⃣ **Instale as Dependências**

```bash
npm install
```

### 3️⃣ **Configuração do Ambiente**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
PORT=3000
SESSION_PATH=./auth_info.json
```

---

## ⚙️ **Configuração**

### 📲 **Sessão do WhatsApp**

1. Inicie o servidor com o comando:

```bash
node index.js
```

2. Um **QR Code** será exibido no terminal.  
3. Abra o **WhatsApp** no celular.  
4. Vá até **Dispositivos Conectados > Conectar Novo Dispositivo**.  
5. Escaneie o **QR Code** exibido no terminal.

⚠️ **Importante:** Certifique-se de escanear rapidamente para evitar expiração.

---

## ▶️ **Execução**

### **Iniciar o Servidor**

```bash
node index.js
```

### **Executar em Modo de Desenvolvimento**

```bash
npm run dev
```

Se tudo estiver certo, você verá:

```
🚀 Servidor rodando na porta 3000
✅ Conectado ao WhatsApp!
```

---

## 📤 **Endpoints**

### 🟢 **Validar Número do WhatsApp**

- **Rota:** `POST /check-whatsapp`
- **Descrição:** Verifica se um número está registrado no WhatsApp.
- **Parâmetros:**
  - `phoneNumber` (string, obrigatório) - Número com código do país (ex: `5511999999999`).

**Exemplo de Requisição no Postman:**

```json
{
  "phoneNumber": "5511999999999"
}
```

**Exemplo de Resposta:**

```json
{
  "phoneNumber": "5511999999999",
  "existsOnWhatsApp": true
}
```

**Códigos de Status:**
- `200 OK`: Número verificado com sucesso.  
- `400 Bad Request`: Parâmetros inválidos.  
- `408 Request Timeout`: Falha na conexão com WhatsApp.  
- `500 Internal Server Error`: Erro interno.

---

## 📊 **Exemplo de Uso**

**Requisição via cURL:**

```bash
curl -X POST http://localhost:3000/check-whatsapp \
-H "Content-Type: application/json" \
-d '{"phoneNumber": "5511999999999"}'
```

---

## 🛡️ **Boas Práticas**

- Sempre reinicie o servidor após alterações no código.  
- Escaneie o QR Code imediatamente após ele ser exibido.  
- Monitore os logs para identificar erros rapidamente.  
- Use ferramentas como **PM2** para gerenciar o servidor em produção.

---

## 🐞 **Solução de Problemas**

### ❗ **Erro: `QR refs attempts ended`**
- Delete a pasta `auth_info.json`.  
- Reinicie o servidor.  
- Escaneie o QR Code novamente.

### ❗ **Erro: `Request Time-out`**
- Aumente o `connectTimeoutMs` no arquivo `index.js`.  
- Certifique-se de que não há bloqueio na rede (firewall ou VPN).

---

## 👥 **Contribuição**

1. Faça um **Fork** do projeto.  
2. Crie uma **branch** para sua feature/fix: `git checkout -b minha-feature`.  
3. Faça o **commit**: `git commit -m "[QAOPS-T001] Adiciona nova funcionalidade X"`  
4. Faça um **push**: `git push origin minha-feature`.  
5. Abra um **Pull Request**.

---

## 📄 **Licença**

Este projeto está sob a licença **MIT**. Consulte o arquivo **LICENSE** para mais informações.

---

## 📞 **Contato**

- **Desenvolvedor:** Igor Silva  
- **Email:** [igorrsilvaa920@gmail.com](mailto:igorrsilvaa920@gmail.com)  
- **Instagram:** [igor.codes](https://www.instagram.com/igor.codes/?theme=dark)  
- **Portfolio:** [igor.code](https://linktr.ee/igor.code)

---
