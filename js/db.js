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
    // Supondo que você esteja usando um ORM ou driver de banco de dados SQL
    const resultado = await suaConexaoDeBancoDeDados.query('SELECT * FROM etiquetas WHERE id = ?', [id]);
    return resultado[0]; // Supondo que 'resultado' é um array de etiquetas
}
module.exports = { selectCustomers, insertCustomer, updateStatus, excluirSetupUsiPorId, getMaquinasPorCentroCusto, getEtiquetas, insertEtq, buscarEtiquetaPorId };