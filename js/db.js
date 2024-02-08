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
//___________________________________________________________________________________


module.exports = { selectCustomers, insertCustomer };