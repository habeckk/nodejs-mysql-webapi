// Obtém uma referência para o contêiner dos cards
const cardContainer = document.getElementById('dialog');
const cards = document.querySelectorAll('.card');
let cardPositions = [];

// Carrega as posições dos cards do localStorage, se existirem
if (localStorage.getItem('cardPositions')) {
  cardPositions = JSON.parse(localStorage.getItem('cardPositions'));
} else {
  // Define as posições padrão se não houver dados no localStorage
  cardPositions = Array.from(cards).map((_, index) => index);
  saveCardPositions();
}

// Renderiza os cards na posição correta
cardPositions.forEach(position => {
  cardContainer.appendChild(cards[position]);
});

// Adiciona os eventos necessários para cada card
cards.forEach((card, index) => {
  card.addEventListener('dragstart', dragStart);
  card.addEventListener('dragover', dragOver);
  card.addEventListener('drop', drop);
});

let draggedCard = null;

function dragStart(event) {
  draggedCard = this;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', null);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const targetCard = this;
  if (draggedCard !== targetCard) {
    const cardContainer = targetCard.parentNode;
    cardContainer.insertBefore(draggedCard, targetCard);

    const draggedIndex = Array.from(cards).indexOf(draggedCard);
    const targetIndex = Array.from(cards).indexOf(targetCard);
    updateCardPositions(draggedIndex, targetIndex);
    saveCardPositions();
  }
}

function updateCardPositions(draggedIndex, targetIndex) {
  const draggedPosition = cardPositions.splice(draggedIndex, 1)[0];
  cardPositions.splice(targetIndex, 0, draggedPosition);

  // Imprime as posições dos cards no console
  console.log(cardPositions);
}


function saveCardPositions() {
  localStorage.setItem('cardPositions', JSON.stringify(cardPositions));
}

function carregarValores1() {
  window.location.href = '/html/SSU.html'
}
function carregarValores2() {
  window.location.href = '/html/ETQ.html'
}
function carregarValores3() {
  window.location.href = '/html/APF.html'
}
function carregarValores4() {
  window.location.href = '/html/CAD.html'
}
function carregarValores5() {
  window.location.href = '/html/SOFTDESK.html'
}
