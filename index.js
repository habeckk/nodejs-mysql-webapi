require("dotenv").config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const db = require('./db'); // Importe o arquivo db.js
const cors = require('cors'); // Importe o pacote CORS

app.use(express.json());
app.use(cors()); // Use o middleware do CORS para permitir solicitações de todas as origens

app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

//___________________________________________________________________________________
// Defina a rota /clientes aqui
//___________________________________________________________________________________
app.get('/clientes', async (req, res) => {
    try {
        const results = await db.selectCustomers();
        res.json(results);
    } catch (error) {
        console.error('Erro ao obter clientes:', error);
        res.status(500).json({ error: 'Erro ao obter clientes' });
    }
});

//___________________________________________________________________________________
// Rota para obter detalhes de um cliente pelo ID
//___________________________________________________________________________________
app.get('/clientes/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const customer = await db.selectCustomerById(id);
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter cliente:', error);
        res.status(500).json({ error: 'Erro ao obter cliente' });
    }
});
//___________________________________________________________________________________
// Rota para excluir um cliente pelo ID
//___________________________________________________________________________________
app.delete('/clientes/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Chame a função para excluir o cliente pelo ID
        const result = await db.deleteCustomerById(id);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cliente excluído com sucesso' });
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
});
//___________________________________________________________________________________
// Rota para adicionar um novo cliente
//___________________________________________________________________________________
app.post('/clientes', async (req, res) => {
    const { nome, Idade } = req.body;

    try {
        const result = await db.insertCustomer(nome, Idade);
        res.status(201).json({ message: 'Cliente adicionado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar cliente:', error);
        res.status(500).json({ error: 'Erro ao adicionar cliente' });
    }
});
//___________________________________________________________________________________
// Alterar um cliente pelo ID
//___________________________________________________________________________________
app.put('/clientes/:id', async (req, res) => {
    
    const clienteId = req.params.id;
    const { novoNome, novaIdade } = req.body;

    console.log('ID do cliente:', clienteId);
    console.log('Novo nome:', novoNome);
    console.log('Nova idade:', novaIdade);
    
    if (!novoNome || !novaIdade) {
        return res.status(400).json({ error: 'Nome e idade são campos obrigatórios' });
    }

    try {
        const result = await db.updateCustomer(clienteId, novoNome, novaIdade);
        res.json({ message: 'Cliente atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
});

//___________________________________________________________________________________
// Inicia o servidor
//___________________________________________________________________________________
app.listen(port, () => {
    console.log(`API funcionando na porta ${port}`);
});
