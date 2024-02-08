const mysql = require('mysql2/promise');

const client = mysql.createPool(process.env.CONNECTION_STRING);

//___________________________________________________________________________________
// Defina a rota /clientes aqui
//___________________________________________________________________________________
async function selectCustomers() {
    const res = await client.query('SELECT * FROM clientes');
    return res[0];
}
//___________________________________________________________________________________
// Rota para obter detalhes de um cliente pelo ID
//___________________________________________________________________________________
async function selectCustomerById(id) {
    const res = await client.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return res[0][0]; // Retorna o primeiro resultado, se houver
}
//___________________________________________________________________________________
// Excluindo um cliente
//___________________________________________________________________________________
async function deleteCustomerById(id) {
    const res = await client.query('DELETE FROM clientes WHERE id = ?', [id]);
    return res[0];
}
//___________________________________________________________________________________
// Excluindo um cliente
//___________________________________________________________________________________
async function insertCustomer(name, Idade) {
    const res = await client.query('INSERT INTO clientes (nome, Idade) VALUES (?, ?)', [name, Idade]);
    return res[0]; // Retorna informações sobre a inserção
}
//___________________________________________________________________________________
// Alterar um cliente pelo ID
//___________________________________________________________________________________
async function updateCustomer(id, novoNome, novaIdade) {
    const query = 'UPDATE clientes SET nome = ?, Idade = ? WHERE id = ?';
    const values = [novoNome, novaIdade, id];

    try {
        const result = await client.query(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = { selectCustomers, selectCustomerById, insertCustomer, updateCustomer };