document.addEventListener('DOMContentLoaded', function () {
    const adminLink = document.getElementById('adminLink'); // Adicione este seletor para o botão de administração
    const userRole = localStorage.getItem('userRole'); 
    const profileImageElement = document.getElementById('profile-image');
    const uploadImageInput = document.getElementById('upload-image');
    const historyButton = document.getElementById('history-button');
    const historyPopup = document.getElementById('history-popup');
    const closeHistoryPopupButton = document.getElementById('close-history-popup');
    const orderHistoryContainer = document.getElementById('order-history');
    const editProfileButton = document.getElementById('edit-profile-button');
    const editProfilePopup = document.getElementById('edit-profile-popup');
    const closeEditProfilePopupButton = document.getElementById('close-edit-profile-popup');
    const editProfileForm = document.getElementById('edit-profile-form');
    const nameEditInput = document.getElementById('name-edit');
    const emailEditInput = document.getElementById('email-edit');
    const favoriteGamesList = document.getElementById('favoriteGames');
    const logoutLink = document.getElementById('logoutLink');
    
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

    checkAuthentication();

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

    

    // Recupera o userId do localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('Usuário não autenticado. Redirecionando para o login...');
        window.location.href = 'http://localhost:8080/cadastro'; // Redireciona para a página de login se o userId não estiver disponível
        return;
    }

    // Seleção de elementos da página
    

    // Função para carregar perfil do usuário
    function loadUserProfile() {
        fetch(`http://localhost:8080/api/userprofiles/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    const { name, email, profileImage } = data;
                    document.getElementById('name').textContent = name;
                    document.getElementById('email').textContent = email;
                    nameEditInput.value = name;
                    emailEditInput.value = email;
                }
            })
            .catch(error => console.error('Erro ao carregar perfil do usuário:', error));
    }

    // Função para buscar jogos favoritos do usuário
    function fetchFavoriteGames() {
        const apiUrl = `http://localhost:8080/api/userprofiles/${userId}/favoritegames`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(favoriteGames => {
                favoriteGames.forEach(favoriteGame => {
                    fetchGameDetails(favoriteGame.id, favoriteGame.gameId);
                });
            })
            .catch(error => console.error('Erro ao buscar jogos favoritos:', error));
    }

    // Função para buscar detalhes dos jogos favoritos
    function fetchGameDetails(id, gameId) {
        const gameApiUrl = `http://localhost:8080/games/${gameId}`;
        fetch(gameApiUrl)
            .then(response => response.json())
            .then(game => {
                const favoriteGamesList = document.getElementById('favorite-games');
                if (!favoriteGamesList) {
                    console.error('Elemento favoriteGames não encontrado');
                    return;
                }
    
                const gameCard = document.createElement('li');
                gameCard.className = 'favorite-game'; // Adiciona uma classe para facilitar a remoção
                gameCard.innerHTML = `
                    <img src="${game.gameImage}" alt="${game.nameGame}">
                    <div class="game-info">
                        <h4>${game.nameGame}</h4>
                        <button class="remove-favorite" data-id="${id}">Remover</button>
                    </div>
                `;
                favoriteGamesList.appendChild(gameCard);
    
                // Adiciona o evento de clique para remover o jogo dos favoritos
                gameCard.querySelector('.remove-favorite').addEventListener('click', function () {
                    const idFavorite = this.getAttribute('data-id');
                    removeFavoriteGame(idFavorite);
                });
            })
            .catch(error => console.error('Erro ao buscar detalhes do jogo:', error));
    }
    

    // Remove um jogo dos favoritos
    function removeFavoriteGame(gameId) {
        fetch(`http://localhost:8080/api/userprofiles/${userId}/favoritegames/${gameId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Remove o jogo da lista
                const gameElement = document.querySelector(`.remove-favorite[data-id="${gameId}"]`).closest('.favorite-game');
                if (gameElement) {
                    gameElement.remove();
                }
            } else {
                console.error('Erro ao remover jogo dos favoritos');
            }
        })
        .catch(error => console.error('Erro ao remover jogo dos favoritos:', error));
    }

    // Função para carregar o histórico de pedidos
    function loadOrderHistory() {
        fetch(`http://localhost:8080/purchase-history/user/${userId}`)
            .then(response => {
                console.log('Status da resposta:', response.status);
                return response.json();
            })
            .then(purchases => {
                console.log('Dados do histórico de pedidos:', purchases);
                orderHistoryContainer.innerHTML = '';
                purchases.forEach(purchase => addOrderHistoryElement(purchase));
            })
            .catch(error => console.error('Erro ao carregar histórico de pedidos:', error));
    }

    // Adiciona um item ao histórico de pedidos
    function addOrderHistoryElement(purchase) {
        const historyElement = document.createElement('li');
        historyElement.innerHTML = `
            <img src="${purchase.gameImage}" alt="${purchase.gameName}" style="max-width: 100px;">
            <div class="game-info">
                <h4>${purchase.gameName}</h4>
                <p>Quantidade: ${purchase.quantity}</p>
                <p class="price">R$ ${purchase.gamePrice.toFixed(2)}</p>
                <p>Status: ${purchase.deliveryStatus}</p>
            </div>
        `;
        orderHistoryContainer.appendChild(historyElement);
    }

    // Atualiza as informações do perfil
    function updateProfile(name, email) {
        fetch(`http://localhost:8080/api/userprofiles/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('name').textContent = name;
                document.getElementById('email').textContent = email;
                editProfilePopup.style.display = 'none';
            } else {
                console.error('Erro ao atualizar perfil');
            }
        })
        .catch(error => console.error('Erro ao atualizar perfil:', error));
    }

    // Manipulador para o botão de histórico de pedidos
    historyButton.addEventListener('click', function () {
        historyPopup.style.display = 'block';
        loadOrderHistory();
    });

    // Manipulador para o botão de fechar o popup de histórico de pedidos
    closeHistoryPopupButton.addEventListener('click', function () {
        historyPopup.style.display = 'none';
    });

    // Manipulador para o botão de editar perfil
    editProfileButton.addEventListener('click', function () {
        editProfilePopup.style.display = 'block';
    });

    // Manipulador para o botão de fechar o popup de editar perfil
    closeEditProfilePopupButton.addEventListener('click', function () {
        editProfilePopup.style.display = 'none';
    });

    // Manipulador para o formulário de edição de perfil
    editProfileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = nameEditInput.value;
        const email = emailEditInput.value;
        updateProfile(name, email);
    });

    // Função para carregar a imagem de perfil do localStorage
    function loadProfileImage() {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            profileImageElement.src = savedImage;
        } else {
            profileImageElement.src = './img/default-profile.jpg'; // Imagem padrão se não houver imagem salva
        }
    }

    // Manipulador para o upload de nova imagem de perfil
    profileImageElement.addEventListener('click', function () {
        uploadImageInput.click();
    });

    uploadImageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImageElement.src = e.target.result;
                localStorage.setItem('profileImage', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Manipulador para o botão de logout
    logoutLink.addEventListener('click', function () {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        window.location.href = 'http://localhost:8080/cadastro';
    });

    // Carregar perfil do usuário ao carregar a página
    loadUserProfile();
    loadProfileImage();
    fetchFavoriteGames();
    handleLogout()
});
