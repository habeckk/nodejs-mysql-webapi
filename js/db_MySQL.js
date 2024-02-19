const mysql = require('mysql2/promise');
const client = mysql.createPool(process.env.CONNECTION_STRING);

// Função para obter uma conexão do pool
async function getConnection() {
    try {
        const connection = await client.getConnection();
        return connection;
    } catch (error) {
        throw error;
    }
}
//___________________________________________________________________________________
// Defina a rota /clientes aqui
//___________________________________________________________________________________

async function selectCustomers() {
    const res = await client.query('SELECT * FROM setupusi');
    return res[0];
}

//___________________________________________________________________________________
// Incluindo um cliente
//___________________________________________________________________________________
async function insertCustomer( HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs) {
    const res = await client.query('INSERT INTO setupusi ( HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ HRpedido, login, cc, maquina, item, operacao, lote, horario, status, calibrador, HRfinalizado, obs]);
    return res[0]; // Retorna informações sobre a inserção
}

//___________________________________________________________________________________
// No seu arquivo bd.js
//___________________________________________________________________________________

async function updateStatus(id, novoStatus) {
    const query = 'UPDATE setupusi SET status = ? WHERE Id = ?';
    const values = [novoStatus, id];

    try {
        const result = await client.query(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}
//___________________________________________________________________________________
// Função para excluir um cliente pelo ID
//___________________________________________________________________________________

async function excluirSetupUsiPorId(id) {
    const res = await client.query('DELETE FROM setupusi WHERE id = ?', [id]);
    return res[0];
}
//___________________________________________________________________________________
// Carregar Máquinas por centro de custo selecionado
//___________________________________________________________________________________
async function getMaquinasPorCentroCusto(centroCusto) {
    let connection;
    try {
        connection = await getConnection();
        const query = 'SELECT Maquina FROM rotina_faci_status_maquina WHERE C_C = ?';
        const [rows] = await connection.query(query, [centroCusto]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
//___________________________________________________________________________________
// Athenticar usuário
//___________________________________________________________________________________
async function authenticateUser(username, password) {
    let connection;
    try {
        connection = await getConnection();
        const query = 'SELECT * FROM usuario WHERE username = ? AND password = ?';
        const [rows] = await connection.execute(query, [username, password]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = { selectCustomers, insertCustomer, updateStatus, excluirSetupUsiPorId, getMaquinasPorCentroCusto, authenticateUser };