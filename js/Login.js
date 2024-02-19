// login.js

// Função para lidar com o login
function login() {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5500/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => {
        if (response.ok) {
            // Se a resposta do servidor for bem-sucedida, você pode redirecionar o usuário ou fazer outras ações necessárias
            console.log('Login bem-sucedido');
            // Aqui você pode redirecionar o usuário para outra página, exibir uma mensagem de sucesso, etc.
        } else {
            // Se houver um erro no login, você pode exibir uma mensagem de erro para o usuário
            console.log('Credenciais inválidas');
            // Aqui você pode exibir uma mensagem de erro para o usuário, recarregar a página de login, etc.
        }
    })
    .catch(error => {
        console.error('Erro ao tentar fazer login:', error);
    });
}

// Adiciona um ouvinte de evento para o botão de login
document.getElementById('loginButton').addEventListener('click', function(event) {
  // Previne o comportamento padrão do formulário de ser enviado
  event.preventDefault();
  // Chama a função login() quando o botão de login é clicado
  login();
});

