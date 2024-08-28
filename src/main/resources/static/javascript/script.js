document.addEventListener('DOMContentLoaded', () => {
    const carrosselLancamentos = document.getElementById('carrossel-lancamentos');
    const carrosselDestaques = document.getElementById('carrossel-destaques');
    const formPesquisa = document.getElementById('form-pesquisa');
    const loginLink = document.getElementById('loginLink');
    const profileLink = document.getElementById('profileLink');
    const logoutLink = document.getElementById('logoutLink');
    const adminLink = document.getElementById('adminLink'); // Adicione este seletor para o botão de administração
    const userId = localStorage.getItem('userId'); // Recupera o userId do localStorage
    const userRole = localStorage.getItem('userRole'); 

    // Função para verificar se o usuário está autenticado
    function checkAuthentication() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');

        if (isLoggedIn) {
            loginLink.style.display = 'none';
            profileLink.style.display = 'block';
            logoutLink.style.display = 'block';

            if (userRole === 'ADMIN') {
                adminLink.style.display = 'block'; // Exibe o botão de administração se o usuário for ADMIN
            } else {
                adminLink.style.display = 'none'; // Oculta o botão de administração se o usuário não for ADMIN
            }
        } else {
            loginLink.style.display = 'block';
            profileLink.style.display = 'none';
            logoutLink.style.display = 'none';
            adminLink.style.display = 'none'; // Garante que o botão de administração esteja oculto se o usuário não estiver logado
        }
    }

     // Função para lidar com logout
     function handleLogout() {
        logoutLink.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole'); // Remove a role do usuário ao fazer logout
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'http://localhost:8080/cadastro'; // Redireciona para a página de login após logout
        });
    }

    // Função para carregar lançamentos
    function carregarLancamentos() {
        fetch('http://localhost:8080/games')
            .then(response => response.json())
            .then(data => {
                carrosselLancamentos.innerHTML = ''; // Limpa o carrossel existente
                data.slice(0, 3).forEach((jogo, index) => {
                    const div = document.createElement('div');
                    div.className = `carousel-item${index === 0 ? ' active' : ''}`;
                    div.innerHTML = `
                        <div class="carousel-item-container" data-game-id="${jogo.id}">
                            <img src="${jogo.gameImage}" class="d-block w-100" alt="${jogo.nameGame}" style="height: 500px; object-fit: cover;">
                        </div>
                    `;
                    carrosselLancamentos.appendChild(div);
                });

                // Adiciona o evento de clique aos itens do carrossel
                document.querySelectorAll('.carousel-item-container').forEach(item => {
                    item.addEventListener('click', () => {
                        const gameId = item.getAttribute('data-game-id');
                        window.location.href = `http://localhost:8080/detalhes?id=${gameId}`;
                    });
                });
            })
            .catch(error => console.error('Erro ao carregar lançamentos:', error));
    }

    // Função para carregar destaques
    function carregarDestaques() {
        fetch('http://localhost:8080/games')
            .then(response => response.json())
            .then(data => {
                carrosselDestaques.innerHTML = '';
                data.slice(0, 8).forEach(jogo => { // Limita a 8 jogos
                    const div = document.createElement('div');
                    div.className = 'col-md-3';
                    div.innerHTML = `
                    <div class="card mb-4" data-game-id="${jogo.id}">
                        <img src="${jogo.gameImage}" class="card-img-top" alt="${jogo.nameGame}" style="height: 220px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${jogo.nameGame}</h5>
                            <p class="preco">R$ ${jogo.price.toFixed(2)}</p>
                        </div>
                    </div>
                `;
                    carrosselDestaques.appendChild(div);
                });

                // Adiciona o evento de clique aos cards dos destaques
                document.querySelectorAll('.card').forEach(card => {
                    card.addEventListener('click', () => {
                        const gameId = card.getAttribute('data-game-id');
                        window.location.href = `http://localhost:8080/detalhes?id=${gameId}`;
                    });
                });
            })
            .catch(error => console.error('Erro ao carregar destaques:', error));
    }

    // Verificar autenticação e configurar página
    checkAuthentication();
    handleLogout();

    // Carregar lançamentos e destaques ao carregar a página
    carregarLancamentos();
    carregarDestaques();
});
