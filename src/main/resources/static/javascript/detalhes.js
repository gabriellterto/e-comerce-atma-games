document.addEventListener('DOMContentLoaded', () => {
    const gameDetailsContainer = document.getElementById('game-details');
    const relatedGamesContainer = document.getElementById('related-games');
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    const logoutLink = document.getElementById('logoutLink');
    const adminLink = document.getElementById('adminLink'); // Adicione este seletor para o botão de administração
    const userRole = localStorage.getItem('userRole');

    // Função para verificar se o usuário está autenticado
    function checkAuthentication() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
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



    checkAuthentication();

    // Recupera o userId do localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('Usuário não autenticado. Redirecionando para o login...');
        window.location.href = 'http://localhost:8080/cadastro'; // Redireciona para a página de login se o userId não estiver disponível
        return;
    }

    function loadGameDetails() {
        fetch(`http://localhost:8080/games/${gameId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar detalhes do jogo: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                gameDetailsContainer.innerHTML = `
                    <h2>${data.nameGame}</h2>
                    <img src="${data.gameImage}" alt="${data.nameGame}" class="img-fluid" style="max-width: 600px;">
                    <p><strong>Descrição:</strong> ${data.description}</p>
                    <p><strong>Desenvolvedor:</strong> ${data.developer}</p>
                    <p><strong>Editora:</strong> ${data.publisher}</p>
                    <p><strong>Gênero:</strong> ${data.genre}</p>
                    <p><strong>Preço:</strong> R$ ${data.price.toFixed(2)}</p>
                    <p><strong>Data de Lançamento:</strong> ${new Date(data.releaseDate).toLocaleDateString()}</p>
                    <button id="add-to-cart-button" class="btn btn-success mt-3">Adicionar ao Carrinho</button>
                    <button id="buy-now-button" class="btn btn-primary mt-3">Comprar Agora</button>
                `;
                loadRelatedGames(data.categoryId);
    
                const addToCartButton = document.getElementById('add-to-cart-button');
                const buyNowButton = document.getElementById('buy-now-button');
    
                if (addToCartButton) {
                    addToCartButton.addEventListener('click', () => {
                        handleAddToCart(gameId, data.nameGame);
                    });
                }
    
                if (buyNowButton) {
                    buyNowButton.addEventListener('click', () => {
                        handleBuyNow(gameId, data.nameGame);
                    });
                }
            })
            .catch(error => console.error(error));
    }

    function handleAddToCart(gameId, gameName) {
        if (!userId) {
            console.error('userId não encontrado. Verifique o login do usuário.');
            alert('Erro ao adicionar jogo ao carrinho. Você deve estar logado.');
            return;
        }
    
        // Primeiro, tente adicionar o jogo ao carrinho
        addToCart(gameId, gameName)
            .catch(error => {
                if (error.message.includes('404')) {
                    // Se o carrinho não existir, crie um novo carrinho e tente adicionar o jogo novamente
                    createCart()
                        .then(() => addToCart(gameId, gameName))
                        .catch(error => {
                            console.error('Erro ao criar carrinho:', error);
                            alert('Erro ao criar carrinho. Verifique o console para mais detalhes.');
                        });
                } else {
                    // Outros erros ao adicionar o jogo ao carrinho
                    console.error('Erro ao adicionar jogo ao carrinho:', error);
                    alert('Erro ao adicionar jogo ao carrinho. Verifique o console para mais detalhes.');
                }
            });
    }
    
    // Função para criar um novo carrinho
    function createCart() {
        return fetch(`http://localhost:8080/api/cart/${userId}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao criar o carrinho: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Novo carrinho criado:', data);
        });
    }
    
    // Função para adicionar o jogo ao carrinho
    function addToCart(gameId, gameName) {
        return fetch(`http://localhost:8080/api/cart/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
        .then(response => {
            if (response.status === 404) {
                // Se o carrinho não existir, lançar um erro para que a criação do carrinho seja tentada
                throw new Error('404');
            }
            if (!response.ok) {
                throw new Error('Erro ao verificar o carrinho: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const cart = Array.isArray(data) ? data : data.items || [];
            const isInCart = cart.some(item => item.gameId === parseInt(gameId));
            if (isInCart) {
                alert('Este jogo já está no seu carrinho.');
            } else {
                return fetch('http://localhost:8080/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: JSON.stringify({
                        userProfileId: userId,
                        gameId: gameId,
                        quantity: 1
                    })
                });
            }
        })
        .then(response => {
            if (response && !response.ok) {
                throw new Error('Erro ao adicionar ao carrinho: ' + response.statusText);
            }
            if (response) {
                return response.json();
            }
        })
        .then(data => {
            if (data) {
                console.log('Jogo adicionado ao carrinho:', data);
                alert('Jogo adicionado ao carrinho!');
            }
        });
    }

    function loadRelatedGames(categoryId) {
        fetch(`http://localhost:8080/games/category/${categoryId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da API: ' + response.status);
                }
                return response.json();
            })
            .then(games => {
                console.log(games);
                relatedGamesContainer.innerHTML = '';
                if (!Array.isArray(games) || games.length === 0) {
                    relatedGamesContainer.innerHTML = '<p>Não há jogos relacionados disponíveis.</p>';
                } else {
                    games.forEach(game => {
                        // Exclui o jogo atual da lista de relacionados
                        if (game.id !== parseInt(gameId)) {
                            relatedGamesContainer.innerHTML += `
                                <a href="http://localhost:8080/detalhes?id=${game.id}" class="list-group-item">
                                    <img src="${game.gameImage}" alt="${game.nameGame}" class="img-fluid" style="width: 80px; height: auto;">
                                    <p>${game.nameGame}</p>
                                </a>
                            `;
                        }
                    });
                }
            })
            .catch(error => console.error('Erro ao carregar jogos relacionados:', error));
    }
    
    // Função para adicionar o jogo ao carrinho
    function createCart() {
        return fetch(`http://localhost:8080/api/cart/${userId}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao criar o carrinho: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Novo carrinho criado:', data);
        });
    }
    
    // Função para obter o token de autenticação
    function getAuthToken() {
        return localStorage.getItem('authToken'); // Ajuste conforme necessário
    }
    

    function getAuthToken() {
        return 'token'; // Substitua pela lógica real para obter o token de autenticação
    }

    logoutLink.addEventListener('click', function () {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        window.location.href = 'http://localhost:8080/cadastro';
    });
    handleLogout()
    loadGameDetails();
});
