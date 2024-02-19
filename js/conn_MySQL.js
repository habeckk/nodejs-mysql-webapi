require("dotenv").config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const db = require('./db_MySQL'); // Importe o arquivo db.js
const cors = require('cors'); // Importe o pacote CORS

app.use(express.json());
app.use(cors()); // Use o middleware do CORS para permitir solicitações de todas as origens
app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));


// Rota para lidar com solicitações GET para o arquivo PDF
app.get('/pdf/:id', (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, 'C:/Users/fernandoh/Downloads/', `${id}.pdf`);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).send('Arquivo não encontrado');
    }
});

// Rota para adicionar um novo cliente
app.post('/setupusi', async (req, res) => {
    const { HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs } = req.body;

    try {
        const result = await db.insertCustomer(HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs);
        res.status(201).json({ message: 'Setup adicionado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar Setup:', error);
        res.status(500).json({ error: 'Erro ao adicionar Setup' });
    }
});

// Rota para obter os setups existentes
app.get('/setupusi', async (req, res) => {
    try {
        const setups = await db.selectCustomers();
        res.status(200).json(setups);
    } catch (error) {
        console.error('Erro ao buscar setups:', error);
        res.status(500).json({ error: 'Erro ao buscar setups' });
    }
});

// Rota para atualizar o status da solicitação
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

// Rota para lidar com a exclusão de um setup de usinagem pelo ID
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

// Rota para obter as máquinas associadas a um centro de custo específico
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

// Rota para obter os user existentes
app.get('/api/login', async (req, res) => {
    try {
        const user = await db.authenticateUser();
        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar user:', error);
        res.status(500).json({ error: 'Erro ao buscar user' });
    }
});

// Rota para autenticação de usuário
app.route('/login')
    .get((req, res) => {
        // Implemente o tratamento de GET conforme necessário
    })
    .post(async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await db.authenticateUser(username, password);
            if (user.length > 0) {
                // Redirecionar para a página menu.html
                res.status(200).send('Login bem-sucedido');
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao autenticar usuário:', error);
            res.status(500).json({ error: 'Erro ao autenticar usuário' });
        }
    });

app.get('/html/menu.html', function(req, res) {
    if (req.session && req.session.user) {
        // Se o usuário estiver autenticado, sirva a página de menu
        res.sendFile(__dirname + '/html/Menu.html');
    } else {
        // Se o usuário não estiver autenticado, redirecione para a página de login
        res.redirect('/login.html');
    }
});

app.listen(port, () => {
    console.log(`API funcionando na porta ${port}`);
});