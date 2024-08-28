document.addEventListener('DOMContentLoaded', () => {
    // Função para verificar se o usuário é administrador
    function verificarAdministrador() {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:8080/api/auth/user-info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.email.endsWith('@atma.com.br')) {
                    document.getElementById('admin-link').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Erro ao verificar administrador:', error);
            });
        }
    }

    // Função para carregar e exibir jogos
    function carregarJogos() {
        fetch('http://localhost:8080/api/games', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            const gamesList = document.getElementById('games-list');
            gamesList.innerHTML = data.map(jogo => `
                <div class="game-card">
                    <h2>${jogo.nome}</h2>
                    <p>${jogo.descricao}</p>
                    <p>Preço: R$ ${jogo.preco.toFixed(2)}</p>
                    <button onclick="comprarJogo(${jogo.id})">Comprar</button>
                    ${data.usuarioAdmin ? `<button onclick="editarJogo(${jogo.id})">Editar</button>` : ''}
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Erro ao carregar jogos:', error);
        });
    }

    // Função para adicionar jogo ao carrinho
    window.comprarJogo = function(jogoId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para adicionar um jogo ao carrinho.');
            return;
        }
        fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ jogoId: jogoId })
        })
        .then(response => {
            if (response.ok) {
                alert('Jogo adicionado ao carrinho com sucesso!');
            } else {
                alert('Falha ao adicionar o jogo ao carrinho.');
            }
        })
        .catch(error => {
            console.error('Erro ao adicionar jogo ao carrinho:', error);
        });
    }

    // Função para editar jogo
    window.editarJogo = function(jogoId) {
        window.location.href = `adm.html?jogoId=${jogoId}`;
    }

    // Inicializar
    verificarAdministrador();
    carregarJogos();
});
