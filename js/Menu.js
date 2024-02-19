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
function carregarValores2() {
  window.location.href = '/html/SSU.html'
}
function carregarValores3() {
  window.location.href = '/html/usinagem_setup.html'
}
function carregarValores7() {
  window.location.href = '/html/gravartela.html'
}
function carregarValores6() {
  window.location.href = '/html/etiquetas.html'
}
function carregarValores8() {
  window.location.href = '/Teste/app.html'
}
