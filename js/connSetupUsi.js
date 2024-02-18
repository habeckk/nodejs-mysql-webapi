require("dotenv").config();

const express = require('express');

const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT;
const db = require('./db'); // Importe o arquivo db.js
const cors = require('cors'); // Importe o pacote CORS

const bodyParser = require('body-parser');

app.use(express.json());
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

// Configuração do body-parser para analisar pedidos JSON
app.use(bodyParser.json());

// Rota para gerar etiquetas ZPL
app.post('/api/gerar-zpl', (req, res) => {
    try {
        const { labels } = req.body;

        // Gere o conteúdo ZPL com base nos dados recebidos
        let zplContent = "^XA\n^CF0,30\n";
        labels.forEach(label => {
            zplContent += `^FO${label.x},${label.y}^A${label.rotation},${label.fontSize}^FD${label.text}^FS\n`;
        });
        zplContent += "^XZ";

        // Salve o conteúdo ZPL em um arquivo temporário
        const filePath = 'label_template.zpl';
        fs.writeFileSync(filePath, zplContent);

        // Responda com o caminho do arquivo gerado
        res.status(200).json({ filePath });
    } catch (error) {
        console.error('Erro ao gerar etiquetas ZPL:', error);
        res.status(500).json({ error: 'Erro ao gerar etiquetas ZPL' });
    }
});

//___________________________________________________________________________________
// Inicia o servidor
//___________________________________________________________________________________

app.listen(port, () => {
    console.log(`API funcionando na porta ${port}`);
});
