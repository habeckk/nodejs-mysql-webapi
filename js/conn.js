require("dotenv").config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;
const db = require('./db'); // Importe o arquivo db.js
const cors = require('cors'); // Importe o pacote CORS

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para analisar dados do formulário
app.use(cors()); // Use o middleware do CORS para permitir solicitações de todas as origens

//___________________________________________________________________________________
// Rota para lidar com solicitações GET para o arquivo PDF
//___________________________________________________________________________________
app.get('/pdf/:id', (req, res) => {
    const id = req.params.id;
    // Supondo que você tenha uma pasta chamada "pdfs" onde os PDFs estão armazenados
    const filePath = path.join(__dirname, 'C:/Users/fernandoh/Downloads/', `${id}.pdf`);

    // Verifica se o arquivo existe
    if (fs.existsSync(filePath)) {
        // Define o cabeçalho Content-Type para indicar que é um arquivo PDF
        res.setHeader('Content-Type', 'application/pdf');
        // Envia o arquivo PDF como resposta à solicitação
        fs.createReadStream(filePath).pipe(res);
    } else {
        // Se o arquivo não existir, envie uma resposta 404 (não encontrado)
        res.status(404).send('Arquivo não encontrado');
    }
});
//___________________________________________________________________________________
// Defina a rota principal
//___________________________________________________________________________________
app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
//___________________________________________________________________________________
// Rota para adicionar um novo cliente
//___________________________________________________________________________________
app.post('/setupusi', async (req, res) => {
    const { HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs} = req.body;

    try {
        const result = await db.insertCustomer( HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs);
        res.status(201).json({ message: 'Setup adicionado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar Setup:', error);
        res.status(500).json({ error: 'Erro ao adicionar Setup' });
    }
});
//___________________________________________________________________________________
// carregar setup
//___________________________________________________________________________________
// Rota para obter os setups existentes
app.get('/setupusi', async (req, res) => {
    try {
        const setups = await db.selectCustomers(); // Chame a função que obtém os setups do banco de dados
        res.status(200).json(setups); // Envie os setups obtidos como resposta
    } catch (error) {
        console.error('Erro ao buscar setups:', error);
        res.status(500).json({ error: 'Erro ao buscar setups' });
    }
});
//___________________________________________________________________________________
// Rota para atualizar o status da solicitação
// Em connSetupUsi.js

app.put('/atualizar-status/:id', async (req, res) => {
    const setupId = req.params.id;
    const { status } = req.body;

    try {
        const result = await db.updateStatus(setupId, status);
        res.status(200).json({ message: 'Status atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar o status:', error);
        res.status(500).json({ error: 'Erro interno ao atualizar o status.' });
    }
});
//___________________________________________________________________________________
// Rota para lidar com a exclusão de um setup de usinagem pelo ID
//___________________________________________________________________________________
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db.excluirSetupUsiPorId(id);
        res.status(200).json({ message: 'Setup de usinagem excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir setup de usinagem:', error);
        res.status(500).json({ error: 'Erro ao excluir setup de usinagem' });
    }
});

//___________________________________________________________________________________
// Rota para obter as máquinas associadas a um centro de custo específico
//___________________________________________________________________________________
app.get('/maquinas', async (req, res) => {
    const centroCusto = req.query.centroCusto;
    try {
        const maquinas = await db.getMaquinasPorCentroCusto(centroCusto);
        res.status(200).json(maquinas);
    } catch (error) {
        console.error('Erro ao obter máquinas:', error);
        res.status(500).json({ error: 'Erro ao obter máquinas' });
    }
});

//___________________________________________________________________________________
// IMPRESSÃO DE ETIQUETAS
//___________________________________________________________________________________
app.post('/zpl', async (req, res) => {
    const fs = require('fs');
    const path = require('path');

    // Capturando os dados do formulário HTML
    const { printerDirectory, zplData } = req.body;

    // Imprimindo os dados recebidos no console
    console.log('Diretório da Impressora:', printerDirectory);
    console.log('Código ZPL:', zplData);

    // Diretório da impressora compartilhada
    const printerDir = "//172.18.1.232/DPRJ" + printerDirectory.trim();

    // Conteúdo ZPL a ser impresso
    const zplContent = zplData.trim();

    // Nome do arquivo de impressão
    const fileName = 'label_template.zpl';

    // Caminho completo do arquivo de impressão
    const filePath = path.join(printerDir, fileName);

    // Escrever os comandos ZPL no arquivo
    fs.writeFile(filePath, zplContent, (err) => {
        if (err) {
            console.error('Erro ao escrever arquivo ZPL:', err);
        } else {
            console.log('Arquivo ZPL criado com sucesso:', filePath);
        }
    });
});

app.get('/etiqueta', async (req, res) => {
    try {
        const etiquetas = await db.getEtiquetas(); // Função para obter os dados da tabela zpl_data do banco de dados
        res.status(200).json(etiquetas); // Envie os dados obtidos como resposta
    } catch (error) {
        console.error('Erro ao buscar dados da etiqueta:', error);
        res.status(500).json({ error: 'Erro ao buscar dados da etiqueta' });
    }
});

//___________________________________________________________________________________
// Inicia o servidor
//___________________________________________________________________________________

app.listen(port, () => {
    console.log(`API funcionando na porta ${port}`);
});
