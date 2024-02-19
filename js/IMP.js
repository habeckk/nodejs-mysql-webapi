const fs = require('fs');
const path = require('path');

// Diretório da impressora compartilhada
const printerDirectory = '\\\\172.18.1.232\\DPRJ94';

// Comandos ZPL para a etiqueta (exemplo)
const zplData = `
^XA
^FO50,50^A0N,50,50^FDExemplo de etiqueta ZPL^FS
^XZ
`;

// Nome do arquivo de impressão
const fileName = 'label_template.zpl';

// Caminho completo do arquivo de impressão
const filePath = path.join(printerDirectory, fileName);

// Escreva os comandos ZPL no arquivo
fs.writeFile(filePath, zplData, (err) => {
    if (err) {
        console.error('Erro ao escrever arquivo ZPL:', err);
    } else {
        console.log('Arquivo ZPL criado com sucesso:', filePath);
    }
});
