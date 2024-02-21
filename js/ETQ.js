// Variáveis globais
const canvas = new fabric.Canvas('canvas');
const dpiY = 3.75; // Densidade de pixels por polegada (PPI) - padrão para telas de computador
const dpiX = 4.50; // Densidade de pixels por polegada (PPI) - padrão para telas de computador

// Função para adicionar campo de texto
function addTextField() {
    const textField = new fabric.Textbox('Texto da etiqueta', {
      left: 100,
      top: 100,
      fontSize: 18,
      fill: 'black',
      cornerColor: 'blue',
      cornerSize: 10,
      transparentCorners: false,
    });
    canvas.add(textField);
  }

// Função para salvar o design em formato JSON
function saveDesign() {
    const designJSON = JSON.stringify(canvas.toJSON());
    const blob = new Blob([designJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    // Cria um link de download invisível
    const a = document.createElement("a");
    a.href = url;
    a.download = "design_etiqueta.json"; // Nome do arquivo a ser baixado
    a.style.display = "none";
  
    // Adiciona o link ao DOM e clique nele para iniciar o download
    document.body.appendChild(a);
    a.click();
  
    // Remove o link após o download
    URL.revokeObjectURL(url);
}

// Função para excluir o campo de texto selecionado
function deleteSelectedObject() {
    const activeObject = canvas.getActiveObject();
  
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
}

  // Função para alterar o tamanho da fonte dos campos de texto selecionados
function changeFontSize() {
    const fontSizeInput = document.getElementById('font-size');
    const fontSize = parseInt(fontSizeInput.value);
  
    if (selectedObject && selectedObject.type === 'textbox') {
      selectedObject.set('fontSize', fontSize);
      canvas.renderAll();
    }
  }
  // Função para definir o tamanho do canvas com base nos valores inseridos pelo usuário
  function setCanvasSize() {
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const canvasWidthInInches = parseFloat(widthInput.value);
    const canvasHeightInInches = parseFloat(heightInput.value);
  
    const canvasWidthInMillimeters = (canvasWidthInInches * dpiY);
    const canvasHeightInMillimeters = (canvasHeightInInches * dpiX);
  
    canvas.setWidth(canvasWidthInMillimeters);
    canvas.setHeight(canvasHeightInMillimeters);
    canvas.renderAll();
 
  }
//---------------------------------------------------------------------------------
// Função para imprimir o conteúdo dentro de um objeto específico no canvas
function printDesign() {
    const xPos = 1; // Coordenada x da posição desejada
    const yPos = 1; // Coordenada y da posição desejada
    const width = 448; // Largura do retângulo
    const height = 270; // Altura do retângulo
  
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
  
    // Captura a região desejada do canvas principal e desenha na tela temporária
    const mainCanvas = document.getElementById('canvas');
    ctx.drawImage(mainCanvas, xPos, yPos, width, height, 0, 0, width, height);
  
    const imageDataURL = tempCanvas.toDataURL({ format: 'png' });
  
    // Abre uma nova janela com a imagem da posição
    const printWindow = window.open('', '_blank');
    const img = new Image();
    img.src = imageDataURL;
    img.onload = function() {
      printWindow.document.write('<img src="' + imageDataURL + '">');
      printWindow.print();
      printWindow.close();
    };
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------

  // Função para carregar o design salvo
  function loadDesign() {
    const repositorySelect = document.getElementById('repository');
    const selectedRepository = repositorySelect.value;
  
    if (selectedRepository === 'server') {
      // ... código para carregar do servidor (já implementado anteriormente) ...
    } else if (selectedRepository === 'local') {
      // ... código para carregar do Local Storage (já implementado anteriormente) ...
    } else if (selectedRepository === 'file') {
      // Carregar o design de um arquivo local
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json'; // Aceitar apenas arquivos JSON
  
      fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
  
        reader.onload = function(e) {
            const designJSON = e.target.result;
          canvas.loadFromJSON(designJSON, canvas.renderAll.bind(canvas));
          console.log('Design carregado do arquivo local.');
        };
  
        reader.readAsText(file);
      });
  
      // Clique no campo de entrada de arquivo automaticamente
      fileInput.click();
    }
  }

// Função para alinhar os campos selecionados ao topo
function alignTop() {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      let topMostObject = activeObjects[0];
      activeObjects.forEach(function(obj) {
        if (obj.top < topMostObject.top) {
          topMostObject = obj;
        }
      });
  
      activeObjects.forEach(function(obj) {
        obj.set('top', topMostObject.top);
      });
  
      canvas.renderAll();
    }
  }
  
  // Função para centralizar verticalmente os campos selecionados
  function alignMiddle() {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      const canvasMiddleY = canvas.getHeight() / 2;
  
      activeObjects.forEach(function(obj) {
        const objMiddleY = obj.top + obj.height / 2;
        const distanceToMiddle = canvasMiddleY - objMiddleY;
        obj.set('top', obj.top + distanceToMiddle);
      });
  
      canvas.renderAll();
    }
  }
  
  // Função para alinhar os campos selecionados à base
  function alignBottom() {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      let bottomMostObject = activeObjects[0];
      activeObjects.forEach(function(obj) {
        if (obj.top + obj.height > bottomMostObject.top + bottomMostObject.height) {
          bottomMostObject = obj;
        }
      });
  
      activeObjects.forEach(function(obj) {
        obj.set('top', bottomMostObject.top + bottomMostObject.height - obj.height);
      });
  
      canvas.renderAll();
    }
  }
  
  // Função para distribuir os campos selecionados à esquerda
  function distributeLeft() {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 1) {
      const sortedObjects = activeObjects.sort(function(a, b) {
        return a.left - b.left;
      });
  
      const leftMostObject = sortedObjects[0];
      const rightMostObject = sortedObjects[sortedObjects.length - 1];
      const totalWidth = rightMostObject.left + rightMostObject.width - leftMostObject.left;
  
      const spacing = totalWidth / (sortedObjects.length - 1);
      let currentPosition = leftMostObject.left;
  
      sortedObjects.forEach(function(obj) {
        obj.set('left', currentPosition);
        currentPosition += spacing;
      });
  
      canvas.renderAll();
    }
  }

// Função para adicionar uma linha ao canvas
function addLine() {
    const line = new fabric.Line([50, 50, 200, 50], {
      stroke: 'black',
      strokeWidth: 2,
    });
  
    canvas.add(line);
  }
  
  const menuButton1 = document.getElementById('dropdown-btn1');
  const menu1 = document.getElementById('hidden1');
  
  menuButton1.addEventListener('click', () => {
      // Ao clicar no botão, verifica se o menu está visível ou oculto
      const isMenuVisible = menu1.classList.contains('hidden');
  
      // Se o menu estiver oculto, exibe; caso contrário, oculta
      if (isMenuVisible) {
        menu1.classList.remove('hidden');
      } else {
        menu1.classList.add('hidden');
      }
  });
  
  const menuButton2 = document.getElementById('dropdown-btn2');
  const menu2 = document.getElementById('hidden2');
  
  menuButton2.addEventListener('click', () => {
      // Ao clicar no botão, verifica se o menu está visível ou oculto
      const isMenuVisible = menu2.classList.contains('hidden');
  
      // Se o menu estiver oculto, exibe; caso contrário, oculta
      if (isMenuVisible) {
          menu2.classList.remove('hidden');
      } else {
          menu2.classList.add('hidden');
      }
  });  

  const menuButton3 = document.getElementById('dropdown-btn3');
  const menu3 = document.getElementById('hidden3');
  
  menuButton3.addEventListener('click', () => {
      // Ao clicar no botão, verifica se o menu está visível ou oculto
      const isMenuVisible = menu3.classList.contains('hidden');
  
      // Se o menu estiver oculto, exibe; caso contrário, oculta
      if (isMenuVisible) {
          menu3.classList.remove('hidden');
      } else {
          menu3.classList.add('hidden');
      }
  });  

  const menuButton4 = document.getElementById('dropdown-btn4');
  const menu4 = document.getElementById('hidden4');
  
  menuButton4.addEventListener('click', () => {
      // Ao clicar no botão, verifica se o menu está visível ou oculto
      const isMenuVisible = menu4.classList.contains('hidden');
  
      // Se o menu estiver oculto, exibe; caso contrário, oculta
      if (isMenuVisible) {
          menu4.classList.remove('hidden');
      } else {
          menu4.classList.add('hidden');
      }
  });