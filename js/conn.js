require("dotenv").config();

const express = require('express');
const fs = require('fs');
const fs1 = require('fs').promises;
const path = require('path');
const app = express();
const port = process.env.PORT;
const db = require('./db'); // Importe o arquivo db.js
const cors = require('cors'); // Importe o pacote CORS

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware para analisar os corpos das requisições URL-encoded
app.use(cors()); // Use o middleware do CORS para permitir solicitações de todas as origens

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 rota principal 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 LOGIN 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.selectLogin(username, password);
        console.log(result); // Verifique a estrutura do resultado e confirme a presença do campo `access`
        if (result.length > 0) {
            const user = result[0];
            console.log(user); // Verifique se o objeto `user` inclui o campo `access`
            res.status(200).json({
                success: true,
                message: "Login bem-sucedido",
                acess: user.acess // Certifique-se de que esta linha corresponde à estrutura do seu objeto `result`
            });
        } else {
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
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU FIP 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
app.get('/pdfabrir/:fipN', async (req, res) => {
    const fipN = req.params.fipN;

    // Validação do ID
    if (!/^[a-zA-Z0-9_-]+$/.test(fipN)) {
        return res.status(400).send('ID inválido');
    }

    const baseNetworkPath = '\\\\dfs\\SAP\\PP\\QUA\\FIP-PDF';
    const filePath = path.join(baseNetworkPath, `${fipN}.pdf`);

    try {
        // Verifique se o arquivo existe
        await fs.promises.access(filePath, fs.constants.F_OK);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + fipN + '.pdf"');
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    } catch (err) {
        console.error('Erro ao acessar o arquivo:', err);
        return res.status(404).send('Arquivo não encontrado');
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

app.delete('/setupusi/:id', async (req, res) => {
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
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 ETQ SELECT 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

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
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 ETQ IMPRIMIR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
app.post('/zplReset', async (req, res) => {
    const { printerDirectory } = req.body;
    const printerDir = "//172.18.1.232/" + printerDirectory.trim();

    try {
        // Gerar o conteúdo ZPL de reset
        const zplData = '^XA^JUF^XZ';

        // Salvar o arquivo ZPL na pasta da impressora
        const zplFilePath = path.join(printerDir, 'reset_label.zpl');
        await fs1.writeFile(zplFilePath, zplData); 

        res.json({ success: true, message: "15" });
    } catch (error) {
        res.status(500).json({ success: false, message: "16" });
    }
});

app.post('/zpl', async (req, res) => {
    const { printerDirectory, zplData, grfData, qtdetq, infetq } = req.body;
    const printerDir = "//172.18.1.232/" + printerDirectory.trim();

    // Copiando o valor de zplData para uma nova variável
    let zplContent = zplData.replace(/#101@/g, infetq);
    let Dta = getCurrentDate().replace(/-/g, '/');
    zplContent = zplContent.replace(/#100@/g, Dta);

    function getCurrentDate() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    try {
        if (grfData.trim()) {
            const grfFilePath = path.join(printerDir, 'label_template.grf');
            await fs1.writeFile(grfFilePath, grfData.trim()); // Uso correto com async/await
            console.log('Arquivo grf criado com sucesso:', grfFilePath);
        }

        const qtdetqNum = parseInt(qtdetq.trim(), 10);
        for (let i = 0; i < qtdetqNum; i++) {
            const zplFilePath = path.join(printerDir, `label_template_${i}.zpl`);
            await fs1.writeFile(zplFilePath, zplContent.trim()); // Uso correto com async/await
            console.log('Arquivo ZPL criado com sucesso:', zplFilePath);
        }
        res.json({ success: true, message: "12" });
    } catch (error) {
        res.status(500).json({ success: false, message: "14" });
        console.error('Erro ao imprimir etiquetas:', error);
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

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSP ADICIONAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.post('/gdm_setup_polimento', async (req, res) => {
    const { HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs} = req.body;

    try {
        const result = await db.insert_setup_polimento( HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs);
        res.status(201).json({ message: 'Setup adicionado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar Setup:', error);
        res.status(500).json({ error: 'Erro ao adicionar Setup' });
    }
});
//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSP SELECT 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
app.get('/gdm_setup_polimento', async (req, res) => {
    try {
        const setups = await db.select_setup_polimento(); // Chame a função que obtém os setups do banco de dados
        res.status(200).json(setups); // Envie os setups obtidos como resposta
    } catch (error) {
        console.error('Erro ao buscar setups:', error);
        res.status(500).json({ error: 'Erro ao buscar setups' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSP ALTERAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.put('/gdm_setup_polimento/:id', async (req, res) => {
    const setupId = req.params.id;
    const { status } = req.body;

    try {
        const result = await db.update_setup_polimento(setupId, status);
        res.status(200).json({ message: 'Status atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar o status:', error);
        res.status(500).json({ error: 'Erro interno ao atualizar o status.' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSP DELETAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
app.delete('/gdm_setup_polimento/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db.excluir_setup_polimento(id);
        res.status(200).json({ message: 'Setup de usinagem excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir setup de usinagem:', error);
        res.status(500).json({ error: 'Erro ao excluir setup de usinagem' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 IPG ADICIONAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.post('/tabeImpregna', async (req, res) => {
    const { HRpedido, login, Documento_compras, item, Fornecedor, Grupo_mercadorias, Material, Org_compras, Grp_compradores, Centro, Deposito, Data_documento, Qtd_pedido, UM_pedido, Valor_líq_pedido, Moeda, Unid_prc_pedido, Incompleto, Tipo_doc_compras, Centro_fornecedor, Texto_breve, obs} = req.body;

    try {
        const result = await db.inserttabeImpregna(HRpedido, login, Documento_compras, item, Fornecedor, Grupo_mercadorias, Material, Org_compras, Grp_compradores, Centro, Deposito, Data_documento, Qtd_pedido, UM_pedido, Valor_líq_pedido, Moeda, Unid_prc_pedido, Incompleto, Tipo_doc_compras, Centro_fornecedor, Texto_breve, obs);
        res.status(201).json({ message: 'Dados adicionados com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar dados:', error);
        res.status(500).json({ error: 'Erro ao adicionar dados' });
    }
});
//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 IPG SELECT 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
app.get('/tabeImpregna', async (req, res) => {
    try {
        const setups = await db.selecttabeImpregna(); // Chame a função que obtém os setups do banco de dados
        res.status(200).json(setups); // Envie os setups obtidos como resposta
    } catch (error) {
        console.error('Erro ao buscar setups:', error);
        res.status(500).json({ error: 'Erro ao buscar setups' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 IPG ALTERAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.put('/atualizar-status/:id', async (req, res) => {
    const setupId = req.params.id;
    const { status } = req.body;

    try {
        const result = await db.updatetabeImpregna(setupId, status);
        res.status(200).json({ message: 'Status atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar o status:', error);
        res.status(500).json({ error: 'Erro interno ao atualizar o status.' });
    }
});

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 IPG DELETAR 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.delete('/tabeImpregna/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db.excluirtabeImpregnaId(id);
        res.status(200).json({ message: 'Setup de usinagem excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir setup de usinagem:', error);
        res.status(500).json({ error: 'Erro ao excluir setup de usinagem' });
    }
});












//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 PORTA 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

app.listen(port, () => {
    console.log(`API funcionando na porta ${port}`);
});
