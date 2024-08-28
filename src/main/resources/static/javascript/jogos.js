document.addEventListener('DOMContentLoaded', function () {
    const userId = localStorage.getItem('userId'); // Recupera o userId do localStorage
    const loginLink = document.getElementById('loginLink');
    const profileLink = document.getElementById('profileLink');
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
    
    function loadCategories() {
        return fetch('http://localhost:8080/api/categories')
            .then(response => response.json())
            .then(categories => {
                console.log('Categorias carregadas:', categories);
                return categories;
            })
            .catch(error => console.error('Erro ao carregar categorias:', error));
    }

    function loadGames() {
        return fetch('http://localhost:8080/games')
            .then(response => response.json())
            .then(games => {
                console.log('Jogos carregados:', games);
                return games;
            })
            .catch(error => console.error('Erro ao carregar jogos:', error));
    }

    function organizeGamesByCategory(games, categories) {
        if (!games || !categories) {
            console.error('Jogos ou categorias não estão definidos.');
            return [];
        }
        const categorizedGames = categories.map(category => {
            return {
                ...category,
                jogos: games.filter(game => game.categoryId === category.id)
            };
        });
        console.log('Jogos organizados por categoria:', categorizedGames);
        return categorizedGames;
    }

    function initializePage() {
        checkAuthentication();

        // Carregar categorias e jogos
        Promise.all([loadCategories(), loadGames()])
            .then(([categories, games]) => {
                const categorizedGames = organizeGamesByCategory(games, categories);
                const carouselsContainer = document.getElementById('carousels-container');

                if (!carouselsContainer) {
                    console.error('Elemento carousels-container não encontrado');
                    return;
                }

                categorizedGames.forEach(category => {
                    const carouselId = `carousel-${category.name.toLowerCase()}`;
                    let itemsHtml = '';

                    for (let i = 0; i < category.jogos.length; i += 6) {
                        const activeClass = i === 0 ? 'active' : '';
                        itemsHtml += `<div class="carousel-item ${activeClass}">
                                        <div class="d-flex">`;

                        for (let j = i; j < i + 6 && j < category.jogos.length; j++) {
                            const jogo = category.jogos[j];
                            const isFavorited = isGameFavorited(jogo.id) ? 'favorited' : '';
                            itemsHtml += `<div class="card mx-2" data-game-id="${jogo.id}">
                                            <div class="card-img-container">
                                                <img src="${jogo.gameImage}" class="card-img-top" alt="${jogo.nameGame}">
                                                <div class="favorite-icon ${isFavorited}" data-game-id="${jogo.id}" data-game-name="${jogo.nameGame}"></div>
                                            </div>
                                            <div class="card-body">
                                                <h5 class="card-title">${jogo.nameGame}</h5>
                                                <div class="card-price-container">
                                                    <p class="card-text">R$ ${jogo.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>`;
                        }

                        itemsHtml += `  </div>
                                    </div>`;
                    }

                    const carousel = `
                        <h2>${category.name}</h2>
                        <div class="my-4">
                            <div class="carousel-navigation">
                                <div id="${carouselId}" class="carousel slide">
                                    <div class="carousel-inner">
                                        ${itemsHtml}
                                    </div>
                                    <a class="carousel-control-prev" href="#${carouselId}" role="button" data-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                    <a class="carousel-control-next" href="#${carouselId}" role="button" data-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>
                            </div>
                        </div>`;

                    carouselsContainer.innerHTML += carousel;
                });

                // Configurar favoritos
                document.querySelectorAll('.favorite-icon').forEach(icon => {
                    icon.addEventListener('click', function (event) {
                        event.stopPropagation(); // Impede a propagação do evento para o card
                        const gameId = this.getAttribute('data-game-id');
                        handleFavorite(gameId, this);
                    });
                });

                // Configurar navegação para a página de detalhes
                document.querySelectorAll('.card').forEach(card => {
                    card.addEventListener('click', function () {
                        const gameId = this.getAttribute('data-game-id');
                        window.location.href = `http://localhost:8080/detalhes?id=${gameId}`;
                    });
                });
                handleLogout();
            });
    }

    function isGameFavorited(gameId) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.includes(gameId);
    }

    function handleFavorite(gameId, iconElement) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const gameName = iconElement.getAttribute('data-game-name'); // Obtenha o nome do jogo

        if (favorites.includes(gameId)) {
            favorites = favorites.filter(id => id !== gameId);
            iconElement.classList.remove('favorited');
        } else {
            favorites.push(gameId);
            iconElement.classList.add('favorited');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Atualizar favoritos no backend
        fetch(`http://localhost:8080/api/userprofiles/${userId}/favoritegames`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ userId, gameId, gameName, favorite: !favorites.includes(gameId) })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Favorito atualizado no backend:', data);
        })
        .catch(error => console.error('Erro ao atualizar favorito no backend:', error));
    }

    function getAuthToken() {
        return localStorage.getItem('authToken'); // Recupera o token de autenticação do localStorage
    }

    initializePage();
});
