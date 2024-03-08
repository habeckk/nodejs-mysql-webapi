document.getElementById("INFO1").src = "/img/icons8-logout-96.png";

async function carregarValores0() {
    try {
    // Simulando uma operação bem-sucedida removendo o item e redirecionando.
    localStorage.removeItem('usuarioLogado');
    
    // Se chegou até aqui, significa que não houve erro
    showSuccessMessage('7'); // Mensagem de sucesso

    // Aguarda um pouco antes de redirecionar para dar tempo da mensagem ser vista
    setTimeout(() => {
        window.location.href = '/login.html';
    }, 2500); // Ajuste o tempo conforme necessário

    } catch (error) {
    // Em caso de erro na operação
    console.error(error); // Log do erro
    showSuccessMessage('4'); // Chama a mensagem de erro
    
    // Opcional: redirecionar mesmo assim ou tratar o erro de outra forma
    }
}

function carregarValores() {
    window.location.href = '/html/Menu.html'
}

function carregarValores1() {
    window.location.href = '/login.html'
} 

// Função assíncrona para exibir uma mensagem de sucesso baseada em um ID
async function showSuccessMessage(messageId) {
    try {
        // Carrega o JSON com as mensagens
        const response = await fetch('/json/IdMsg.json'); // Atualize o caminho conforme necessário
        if (!response.ok) {
            throw new Error('Falha ao carregar mensagens');
        }

        const messages = await response.json();
        // Busca a mensagem pelo ID
        const messageData = messages.find(msg => msg.IdMsg === messageId);
        if (!messageData) {
            throw new Error('Mensagem não encontrada');
        }

        let successMessage = document.getElementById('successMessage');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.id = 'successMessage';
            successMessage.className = 'success-message';
            document.body.appendChild(successMessage);
        }

        // Atualiza o conteúdo da mensagem
        successMessage.innerHTML = `
            <img src="${messageData.caminhoImagem}" alt="Imagem de Sucesso" class="success-image">
            <div class="success-text">${messageData.descricao}</div>
        `;

        // Exibe a mensagem
        successMessage.style.display = 'block';

        // Oculta a mensagem após 2 segundos
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 2000);

    } catch (error) {
        console.error('Erro ao exibir a mensagem de sucesso:', error);
    }
}
