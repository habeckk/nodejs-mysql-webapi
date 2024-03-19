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

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 rota principal 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU FIP 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
app.get('/pdfabrir/:fipN', async (req, res) => {
    const fipN = req.params.fipN;
    console.log(fipN + " teste"); // Para debug

    // Validação do ID
    if (!/^[a-zA-Z0-9_-]+$/.test(fipN)) {
        return res.status(400).send('ID inválido');
    }

    const baseNetworkPath = '\\\\dfs\\SAP\\PP\\QUA\\FIP-PDF';
    const filePath = path.join(baseNetworkPath, `00001.pdf`); // Construindo o caminho do arquivo

    // Verifica se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Arquivo não encontrado');
        }
        // Se o arquivo existir, envia o arquivo
        // Para forçar download, você pode descomentar a linha abaixo
        // res.setHeader('Content-Disposition', 'attachment; filename="' + fipN + '.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        fs.createReadStream(filePath).pipe(res);
    });
});
//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 LOGIN 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.post('/login', async (req, res) => {
    const { username, password } = req.body; // Obtem username e password do corpo da requisição
    try {
        const result = await db.selectLogin(username, password);
        if (result.length > 0) {
            // Login bem-sucedido
            res.status(200).json({ success: true, message: "Login bem-sucedido" });
        } else {
            // Falha no login
            res.status(401).json({ success: false, message: "Credenciais inválidas" });
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 APF APONTAMENTO 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.post('/ferr_apont', async (req, res) => {
    const { login, n_op, n_ope, n_user, n_tur, trab_real, uni_trab, conf_final, data_lanc, data_ini, hora_ini, data_fim, hora_fim, status, obs} = req.body;

    try {
        const result = await db.insertferr_apont( login, n_op, n_ope, n_user, n_tur, trab_real, uni_trab, conf_final, data_lanc, data_ini, hora_ini, data_fim, hora_fim, status, obs);
        res.status(201).json({ message: 'Apontamento adicionado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar Apontamento:', error);
        res.status(500).json({ error: 'Erro ao adicionar Apontamento' });
    }
});

app.get('/ferr_apont', async (req, res) => {
    try {
        const setups = await db.selectferr_apont(); // Chame a função que obtém os setups do banco de dados
        res.status(200).json(setups); // Envie os setups obtidos como resposta
    } catch (error) {
        console.error('Erro ao buscar Apontamento:', error);
        res.status(500).json({ error: 'Erro ao buscar Apontamento' });
    }
});

app.put('/ferr_apont/:id', async (req, res) => {
    const { id } = req.params;
    const { trab_real, conf_final, data_fim, hora_fim, status, obs } = req.body;

    try {
        const result = await db.update_ferr_apont(id, trab_real, conf_final, data_fim, hora_fim, status, obs);
        res.status(200).json({ message: 'Apontamento atualizado com sucesso.', id: result });
    } catch (error) {
        console.error('Erro ao atualizar o apontamento:', error);
        res.status(500).json({ error: 'Erro interno ao atualizar o apontamento.' });
    }
});
//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU PDF 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
app.get('/pdf/:id', async(req, res) => {
    const id = req.params.id;

    const result = await db.getItemByFipN(id);
    res.status(200).json(result); // Envie os setups obtidos como resposta
    
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU ADICIONAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

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
//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU SELECT 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
app.get('/setupusi', async (req, res) => {
    try {
        const setups = await db.selectCustomers(); // Chame a função que obtém os setups do banco de dados
        res.status(200).json(setups); // Envie os setups obtidos como resposta
    } catch (error) {
        console.error('Erro ao buscar setups:', error);
        res.status(500).json({ error: 'Erro ao buscar setups' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU ALTERAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

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

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU DELETAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

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

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU SELECT MÁQ 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

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

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU FOLHA PROCESSO 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.get('/setupusiFolha', async (req, res) => {
    const item = req.query.item;
    try {
        const docu = await db.getFolhaProcessoItem(item);
        res.status(200).json(docu);
    } catch (error) {
        console.error('Erro ao obter Folha Processo:', error);
        res.status(500).json({ error: 'Erro ao obter Folha Processo' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 ETQ IMPRIMIR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.post('/zpl', async (req, res) => {

    const fs = require('fs');
    const path = require('path');

    // Capturando os dados do formulário HTML
    const { printerDirectory, zplData, grfData, qtdetq } = req.body;

    // Imprimindo os dados recebidos no console
    console.log('Diretório da Impressora:', printerDirectory);
    console.log('Código ZPL:', zplData);

    if (grfData.trim()) {
        const printerDir1 = "//172.18.1.232/" + printerDirectory.trim();
        // Conteúdo ZPL a ser impresso
        const grfContent = grfData.trim();
        // Nome do arquivo de impressão
        const fileName1 = 'label_template.grf';
        // Caminho completo do arquivo de impressão
        const filePath1 = path.join(printerDir1, fileName1);
        fs.writeFile(filePath1, grfContent, (err) => {
            if (err) {
                console.error('Erro ao escrever arquivo grf:', err);
            } else {
                console.log('Arquivo grf criado com sucesso:', filePath1);
            }
        });
    }
//-----------------------------------------------------------------------------------------------
    // Diretório da impressora compartilhada
    const printerDir = "//172.18.1.232/" + printerDirectory.trim();
    // Conteúdo ZPL a ser impresso
    const zplContent = zplData.trim();
    // Nome do arquivo de impressão
    const fileName = 'label_template.zpl';
    // Caminho completo do arquivo de impressão
    const filePath = path.join(printerDir, fileName);
    // Escrever os comandos ZPL no arquivo
    if (qtdetq.trim()) {
        const qtdetq2 = qtdetq.trim();  

        for (let i = 0; i < qtdetq2; i++) {
            fs.writeFile(filePath, zplContent, (err) => {
                if (err) {
                    console.error('Erro ao escrever arquivo ZPL:', err);
                } else {
                    console.log('Arquivo ZPL criado com sucesso:', filePath);
                }
            });
        }
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 ETQ ADICIONAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.get('/etiqueta', async (req, res) => {
    try {
        const etiquetas = await db.getEtiquetas(); // Função para obter os dados da tabela zpl_data do banco de dados
        res.status(200).json(etiquetas); // Envie os dados obtidos como resposta
    } catch (error) {
        console.error('Erro ao buscar dados da etiqueta:', error);
        res.status(500).json({ error: 'Erro ao buscar dados da etiqueta' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 ETQ GRAVAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.post('/salvaEtq', async (req, res) => {
    const { modelo, nome, cod_etq, grf, cod_zpl, obs} = req.body;

    try {
        const result = await db.insertEtq( modelo, nome, cod_etq, grf, cod_zpl, obs);
        res.status(201).json({ message: 'ETIQUETAS adicionado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar ETIQUETAS:', error);
        res.status(500).json({ error: 'Erro ao adicionar ETIQUETAS' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU SELECT 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.get('/getEtiquetaById/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db.buscarEtiquetaPorId(id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao obter Etiqueta:', error);
        res.status(500).json({ error: 'Erro ao obter Etiquetanas' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 APF GERAR PLANILHA 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

const { gerarPlanilhaXLSX } = require('./db');

app.get('/export-ferr_apont-xlsx', async (req, res) => {
    try {
        const workbook = await gerarPlanilhaXLSX();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=apontamentos.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 INICIAR SEVIDOR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
const { exec } = require('child_process');
app.use(express.static(path.join(__dirname)));

app.get('/executarPython', (req, res) => {
    exec('python ./GRF.py', (error, stderr) => {

        if (error) {
            console.error(`Erro ao executar o script Python: ${error}`);
            return res.status(500).send('Erro ao processar a imagem.');
        }

        const baseNetworkPath = './';
        const filePath = path.join(baseNetworkPath, `2345200R00.GRF`); // Construindo o caminho do arquivo
    
        // Verifica se o arquivo existe
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).send('Arquivo não encontrado');
            }
            // Se o arquivo existir, envia o arquivo
            // Para forçar download, você pode descomentar a linha abaixo
            // res.setHeader('Content-Disposition', 'attachment; filename="' + fipN + '.pdf"');
            res.setHeader('Content-Type', 'application/pdf');
            fs.createReadStream(filePath).pipe(res);
        });
        
    });
});

app.get('/grfabrir', async (req, res) => {

    const baseNetworkPath = '\\\\dfs\\SAP\\PP\\QUA\\FIP-PDF';
    const filePath = path.join(baseNetworkPath, `00006.PDF`); // Construindo o caminho do arquivo

    // Verifica se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Arquivo não encontrado');
        }
        // Se o arquivo existir, envia o arquivo
        // Para forçar download, você pode descomentar a linha abaixo
        // res.setHeader('Content-Disposition', 'attachment; filename="' + fipN + '.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        fs.createReadStream(filePath).pipe(res);
    });
});


app.listen(port, () => {
    console.log(`API funcionando na porta ${port}`);
});
