const sql = require('mssql');

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

// db.js

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

module.exports = { selectCustomers, insertCustomer, updateStatus, excluirSetupUsiPorId, getMaquinasPorCentroCusto, getEtiquetas, insertEtq, buscarEtiquetaPorId, getItemByFipN };