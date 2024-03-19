const express = require('express');
const dbActions = require('../db/db'); // Correto se db.js está em src/db/
const fileOperations = require('../files/fileOperations'); // Correto se fileOperations.js está em src/files/
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'API Funcionando!' }));

// Incluir as demais rotas aqui seguindo o modelo:
// router.[get|post|put|delete]('/rota', dbActions.funcaoAssociada);

//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 APF 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

router.post('/ferr_apont', dbActions.add_ferr_apont);
router.get('/ferr_apont', dbActions.get_ferr_apont);
router.put('/ferr_apont/:id', dbActions.update_ferr_apont);
router.get('/export-ferr_apont-xlsx', dbActions.gerarPlanilhaXLSX);


//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 SSU 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
router.post('/setupusi', dbActions.addSetupUsi);
router.get('/setupusi', dbActions.getSetupsUsi);
router.put('/setupusi/:id', dbActions.updateSetupUsi);
router.delete('/setupusi/:id', dbActions.deleteSetupUsi);
router.get('/pdf/:id', dbActions.getItemByFipN);
router.get('/setupusiFolha', dbActions.getFolhaProcessoItem);

//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 GRUPO DE MÁQUINAS 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

router.get('/maquinas', dbActions.getMaquinasPorCentroCusto);

//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 LOGIN 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥

router.post('/login', dbActions.loginProcess);

//🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥 ETQ 🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥
router.get('/etiqueta', dbActions.getEtiquetas);
router.post('/etiqueta', dbActions.addEtiqueta);
router.get('/etiqueta/:id', dbActions.getEtiquetaById);
router.post('/zpl', fileOperations.printZPL);  // Esta já foi incluída anteriormente
router.post('/pdfabrir/:id', fileOperations.openFip);

// Adicione as rotas restantes seguindo o padrão acima

module.exports = router;
