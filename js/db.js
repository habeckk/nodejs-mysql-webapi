const mysql = require('mysql2/promise');

const client = mysql.createPool(process.env.CONNECTION_STRING);

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
// Alterar dados no servidor
// No seu arquivo bd.js

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
//___________________________________________________________________________________

module.exports = { selectCustomers, insertCustomer, updateStatus, excluirSetupUsiPorId };
