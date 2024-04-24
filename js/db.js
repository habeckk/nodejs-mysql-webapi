const sql = require('mssql');
const ExcelJS = require('exceljs'); // Necessário para a geração de arquivos XLS

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,

    options: {
        encrypt: true, // Caso o servidor exija criptografia SSL
        trustServerCertificate: true, // Esta opção permite que você confie em certificados autoassinados
    }
};
//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 LOGIN 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
async function selectLogin(username, password) {
    try {
        await sql.connect(config);
        // Aqui você deve incluir lógica para verificar username e password
        // Esta é apenas uma estrutura básica
        const result = await sql.query`SELECT * FROM gdm_login WHERE username = ${username} AND password = ${password}`;
        return result.recordset;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}
//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 APF 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
async function insertferr_apont( login, n_op, n_ope, n_user, n_tur, trab_real, uni_trab, conf_final, data_lanc, data_ini, hora_ini, data_fim, hora_fim, status, obs) {
    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO gdm_ferra_apont ( login, n_op, n_ope, n_user, n_tur, trab_real, uni_trab, conf_final, data_lanc, data_ini, hora_ini, data_fim, hora_fim, status, obs) 
                                    VALUES (${login}, ${n_op}, ${n_ope}, ${n_user}, ${n_tur}, ${trab_real}, ${uni_trab}, ${conf_final}, ${data_lanc}, ${data_ini}, ${hora_ini}, ${data_fim}, ${hora_fim}, ${status}, ${obs})`;
        return result;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function selectferr_apont() {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM gdm_ferra_apont`;
        return result.recordset;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function update_ferr_apont(id, trab_real, conf_final, data_fim, hora_fim, status, obs) {
    try {
        await sql.connect(config);
        // A query de atualização precisa ser ajustada conforme a estrutura do seu banco de dados e os nomes das colunas
        const result = await sql.query`UPDATE gdm_ferra_apont SET trab_real = ${trab_real}, conf_final = ${conf_final}, data_fim = ${data_fim}, hora_fim = ${hora_fim}, status = ${status}, obs = ${obs} WHERE Id = ${id}`;
        return result;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
async function insertCustomer(HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs) {
    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO setupusi (HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs) 
                                    VALUES (${HRpedido}, ${login}, ${cc}, ${maquina}, ${item}, ${operacao}, ${lote}, ${horario}, ${status}, ${calibrador}, ${HRfinalizado}, ${obs})`;
        return result;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function selectCustomers() {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM setupusi`;
        return result.recordset;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function updateStatus(id, novoStatus) {
    try {
        await sql.connect(config);
        const result = await sql.query`UPDATE setupusi SET status = ${novoStatus} WHERE Id = ${id}`;
        return result;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function excluirSetupUsiPorId(id) {
    try {
        await sql.connect(config);
        const result = await sql.query`DELETE FROM setupusi WHERE id = ${id}`;
        return result;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU FIP 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
async function getItemByFipN(id) {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM SMP_FIP WHERE Item = ${id}`;
        return result.recordset;
    } catch (error) {
        console.error('Database query error:', error);
        throw error; // É uma boa prática relançar o erro após logá-lo
    } finally {
        await sql.close(); // Isso pode ser problemático se você estiver usando pool de conexões
    }
}
//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 FOLHA DE PROCESSO 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
async function getFolhaProcessoItem(item) {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT Docu FROM ferramentaria_x_item WHERE Item = ${item}`;
        
        return result.recordset;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}
//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 GRUPO DE MÁQUINAS 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
async function getMaquinasPorCentroCusto(centroCusto) {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT Maquina FROM rotina_faci_status_maquina WHERE C_C = ${centroCusto}`;
        return result.recordset;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 ETQ 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
async function getEtiquetas() {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM zpl_data`;
        return result.recordset;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function insertEtq(modelo, nome, cod_etq, grf, cod_zpl, obs) {
    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO zpl_data (modelo, nome, cod_etq, grf, cod_zpl, obs) 
                                    VALUES (${modelo}, ${nome}, ${cod_etq}, ${grf}, ${cod_zpl}, ${obs})`;
        return result;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function buscarEtiquetaPorId(id) {
    try {
        // Supondo que `config` já esteja definido em outro lugar do seu código
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM zpl_data WHERE id = ${id}`;
        return result.recordset; // .recordset contém os registros retornados pela consulta
    } catch (error) {
        console.error('Erro na consulta ao banco de dados:', error);
        throw error; // É uma boa prática relançar o erro após logá-lo
    } finally {
        await sql.close(); // Isso pode ser problemático se você estiver usando pool de conexões
    }
}

//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 EXPORTAR EXCEL APF 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
async function gerarPlanilhaXLSX() {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM gdm_ferra_apont WHERE status = 'Finalizado'`;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        worksheet.columns = [
            //{ header: 'ID', key: 'Id', width: 10 },
            //{ header: 'Login', key: 'login', width: 10 },
            { header: 'Nº da ordem', key: 'n_op', width: 10 },
            { header: 'Descrição da ordem', key: '----', width: 10 },
            { header: 'Operação', key: 'n_ope', width: 10 },
            { header: 'Descrição da operação', key: '----', width: 10 },
            { header: 'Suboperação', key: '----', width: 10 },
            { header: 'Empregado', key: 'n_user', width: 10 },
            { header: 'Tipo de atividade', key: '----', width: 10 },
            { header: 'Trabalho real', key: 'trab_real', width: 15 },
            { header: 'Unidade de trabalho', key: 'uni_trab', width: 15 },
            { header: 'Confirmação final (X=Sim, Nulo=Não)', key: 'conf_final', width: 15 },
            { header: 'Data de lançamento', key: 'data_lanc', width: 15 },
            { header: 'Texto de confirmação', key: '----', width: 10 },
            { header: 'Data do início', key: 'data_ini', width: 15 },
            { header: 'Hora de início (HH:MM:SS)', key: 'hora_ini', width: 10 },
            { header: 'Data do fim', key: 'data_fim', width: 15 },
            { header: 'Hora de fim (HH:MM:SS)', key: 'hora_fim', width: 10 },
            { header: 'Data fim previsão', key: '----', width: 20 },
            { header: 'Hora de fim de previsão (HH:MM:SS)', key: '----', width: 20 },
            { header: 'Nenhum trabalho restante previsto (X=Sim, Nulo=Não)', key: '----', width: 20 },
            { header: 'Trabalho restante', key: '----', width: 20 },
            { header: 'Unidade de medida para trabalho restante', key: '----', width: 20 },
            { header: 'Compensar reservas pendentes (X=Sim, Nulo=Não)', key: '----', width: 20 },
            { header: 'Motivo para desvio', key: '----', width: 20 },
        ];

        // Aplicando estilo ao cabeçalho
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'616366' } // Cor de fundo amarela
            };
            cell.font = {
                bold: true,
                color: { argb: '00A9E0' }, // Cor da fonte azul
                size: 10
            };
            cell.border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            };
        });
        
        result.recordset.forEach(record => {
            // Transforma as datas de 'YYYY-MM-DD' para 'MM/DD/YYYY'
            if (record.data_ini) {
                record.data_ini = record.data_ini.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1');
            }
            if (record.data_fim) {
                record.data_fim = record.data_fim.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1');
            }
            if (record.data_lanc) {
                record.data_lanc = record.data_lanc.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1');
            }        
            // Adiciona a linha transformada
            worksheet.addRow(record);
        });
        

        return workbook; // Retorna o workbook para ser usado fora dessa função
    } catch (error) {
        throw new Error('Erro ao gerar planilha XLSX: ' + error.message);
    } finally {
        await sql.close();
    }
}










//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSP 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
async function insert_setup_polimento(HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs) {
    try {
        await sql.connect(config);
        const result = await sql.query`INSERT INTO gdm_setup_polimento (HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs) 
                                    VALUES (${HRpedido}, ${login}, ${cc}, ${maquina}, ${item}, ${operacao}, ${lote}, ${horario}, ${status}, ${calibrador}, ${HRfinalizado}, ${obs})`;
        return result;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function select_setup_polimento() {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM gdm_setup_polimento`;
        return result.recordset;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function update_setup_polimento(id, novoStatus) {
    try {
        await sql.connect(config);
        const result = await sql.query`UPDATE gdm_setup_polimento SET status = ${novoStatus} WHERE Id = ${id}`;
        return result;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}

async function excluir_setup_polimento(id) {
    try {
        await sql.connect(config);
        const result = await sql.query`DELETE FROM gdm_setup_polimento WHERE id = ${id}`;
        return result;
    } catch (error) {
        throw error;
    } finally {
        await sql.close();
    }
}


//__________________________________________________________________________________________________________
//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 MODULOS 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
module.exports = { selectCustomers,
    insertCustomer,
    updateStatus,
    excluirSetupUsiPorId, 
    getMaquinasPorCentroCusto, 
    getEtiquetas, 
    insertEtq, 
    buscarEtiquetaPorId, 
    getItemByFipN, 
    getFolhaProcessoItem, 
    selectLogin, 
    insertferr_apont, 
    selectferr_apont,
    update_ferr_apont,
    gerarPlanilhaXLSX,

    excluir_setup_polimento,
    update_setup_polimento,
    select_setup_polimento,
    insert_setup_polimento
};