require("dotenv").config();

const express = require('express');
const app = express();
const port = process.env.PORT;
//const db = require('mssql'); // Importe o pacote mssql
const db = require('./db'); // Importe o arquivo db.js
const cors = require('cors'); // Importe o pacote CORS

app.use(express.json());
app.use(cors()); // Use o middleware do CORS para permitir solicitações de todas as origens

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
// Inicia o servidor
//___________________________________________________________________________________
app.listen(port, () => {
    console.log(`API funcionando na porta ${port}`);
});
