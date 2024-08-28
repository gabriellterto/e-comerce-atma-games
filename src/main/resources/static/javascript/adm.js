document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('loginLink');
    const profileLink = document.getElementById('profileLink');
    const logoutLink = document.getElementById('logoutLink');
  
    // Simula a verificação do status de login
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
  
    if (isLoggedIn) {
      loginLink.style.display = 'none';
      profileLink.style.display = 'block';
      logoutLink.style.display = 'block';
    } else {
      loginLink.style.display = 'block';
      profileLink.style.display = 'none';
      logoutLink.style.display = 'none';
    }
  
    logoutLink.addEventListener('click', function() {
      // Código para logout (excluir do localStorage, redirecionar, etc.)
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      window.location.href = 'http://localhost:8080/';
    });
  });
  

document.addEventListener('DOMContentLoaded', () => {
    const gamesTable = document.getElementById('gamesTable').getElementsByTagName('tbody')[0];
    const gameForm = document.getElementById('gameForm');
    const searchQueryInput = document.getElementById('searchQuery');
    const searchButton = document.getElementById('searchButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const filterButton = document.getElementById('filterButton');
    const categorySelect = document.getElementById('category');
    const genreForm = document.getElementById('genreForm');
    const addGenreButton = document.getElementById('addGenreButton');
    const userForm = document.getElementById('userForm');
    const usersTableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    const orderItemsTable = document.getElementById('orderItemsTable');
    const orderItemsForm = document.getElementById('orderItemsForm');

    // Verificação de autenticação e role de usuário
    function checkAuthentication() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userRole = localStorage.getItem('userRole');

        if (!isLoggedIn) {
            window.location.href = 'http://localhost:8080/cadastro';
        } else if (userRole !== 'ADMIN') {
            window.location.href = 'http://localhost:8080/acesso-negado'; // Redireciona para uma página de acesso negado
        } else {
            // Se o usuário está logado e é ADMIN, exibe os links de perfil e sair
            document.getElementById('loginLink').style.display = 'none';
            document.getElementById('profileLink').style.display = 'block';
            document.getElementById('logoutLink').style.display = 'block';
        }
    }

    checkAuthentication();

    let selectedGame = null;
    let isEditingGame = false;
    let isEditingUser = false;
    let categories = []; // Armazena categorias carregadas

    // Função para fazer fetch e manipular resposta
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // Função para carregar categorias e jogos
    async function loadInitialData() {
        categories = await fetchData('http://localhost:8080/api/categories');
        if (categories) {
            populateCategoryFilters();
            await fetchGames();
        }
    }

    // Função para popular filtros de categoria
    function populateCategoryFilters() {
        categoryFilter.innerHTML = '';
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
            categorySelect.appendChild(option.cloneNode(true));
        });
    }

    // Função para adicionar uma nova categoria
    async function addCategory() {
        const genreName = genreForm.genreName.value;
        const response = await fetch('http://localhost:8080/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: genreName })
        });

        if (response.ok) {
            alert('Categoria adicionada com sucesso!');
            genreForm.reset();
            location.reload();
        } else {
            const error = await response.text();
            alert('Erro ao adicionar categoria: ' + error);
        }
    }

    // Evento para o botão de adicionar categoria
    addGenreButton.addEventListener('click', addCategory);

    // Função para carregar jogos
    async function fetchGames(query = '', categoryId = '') {
        const url = query
            ? `http://localhost:8080/games/pesquisa?query=${query}`
            : categoryId
                ? `http://localhost:8080/games/category/${categoryId}`
                : 'http://localhost:8080/games';

        const data = await fetchData(url);
        if (data) {
            updateGamesTable(data);
        }
    }

    async function updateGame() {
        const gameId = selectedGame.id; // Supondo que você tem o ID do jogo selecionado
        const gameData = {
            nameGame: gameForm.gameName.value,
            description: gameForm.gameDescription.value,
            price: gameForm.gamePrice.value,
            developer: gameForm.gameDeveloper.value,
            publisher: gameForm.gamePublisher.value,
            releaseDate: gameForm.gameReleaseDate.value,
            gameImage: gameForm.gameImageUrl.value,
            categoryId: gameForm.category.value,
            genre: categories.find(cat => cat.id === parseInt(gameForm.category.value))?.name || 'Desconhecido'
        };
    
        try {
            const response = await fetch(`http://localhost:8080/games/${gameId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData)
            });
    
            if (response.ok) {
                alert('Jogo atualizado com sucesso!');
                gameForm.reset(); // Limpa o formulário
                isEditingGame = false; // Resetar o estado de edição
                await fetchGames(); // Atualiza a lista de jogos
            } else {
                const error = await response.text();
                alert('Erro ao atualizar jogo: ' + error);
            }
        } catch (error) {
            console.error('Erro ao atualizar jogo:', error);
            alert('Erro inesperado: ' + error.message);
        }
    }


    // Função para atualizar a tabela de jogos
    function updateGamesTable(data) {
        gamesTable.innerHTML = '';
        data.forEach(game => {
            const categoryName = categories.find(category => category.id === game.categoryId)?.name || 'Desconhecido';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${game.id}</td>
                <td>${game.nameGame}</td>
                <td>${game.description}</td>
                <td>${game.price}</td>
                <td>${game.developer}</td>
                <td>${game.releaseDate}</td>
                <td>${categoryName}</td>
                <td>
                    <div class="action-links">
                        <a href="#" class="edit" onclick="editGame(${game.id})">Editar</a>
                        <a href="#" class="delete" onclick="deleteGame(${game.id})">Deletar</a>
                    </div>
                </td>`;
            gamesTable.appendChild(row);
        });
    }

    // Função para carregar um jogo para edição
    window.editGame = async function (id) {
        const game = await fetchData(`http://localhost:8080/games/${id}`);
        if (game) {
            gameForm.gameName.value = game.nameGame;
            gameForm.gameDescription.value = game.description;
            gameForm.gamePrice.value = game.price;
            gameForm.gameDeveloper.value = game.developer;
            gameForm.gamePublisher.value = game.publisher;
            gameForm.gameReleaseDate.value = game.releaseDate;
            gameForm.gameImageUrl.value = game.gameImage;
            gameForm.category.value = game.categoryId;
            selectedGame = game;
            isEditingGame = true;
        }
    };

    // Função para adicionar jogo
    async function addGame() {
        const gameData = {
            nameGame: gameForm.gameName.value,
            description: gameForm.gameDescription.value,
            price: gameForm.gamePrice.value,
            developer: gameForm.gameDeveloper.value,
            publisher: gameForm.gamePublisher.value,
            releaseDate: gameForm.gameReleaseDate.value,
            gameImage: gameForm.gameImageUrl.value,
            categoryId: gameForm.category.value,
            genre: categories.find(cat => cat.id === parseInt(gameForm.category.value))?.name || 'Desconhecido'
        };

        const response = await fetch('http://localhost:8080/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });

        if (response.ok) {
            alert('Jogo adicionado com sucesso!');
            await fetchGames();
        } else {
            const error = await response.text();
            alert('Erro ao adicionar jogo: ' + error);
        }
    }

    // Função para atualizar um jogo
    async function updateUser() {
        const userId = document.querySelector('input[name="userId"]').value;
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        const userPassword = document.getElementById('userPassword').value;
        const userRole = document.getElementById('userRole').value.toUpperCase(); // Ajusta para maiúsculas

        if (!userId || !userName || !userEmail || !userPassword || !userRole) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        const userData = {
            name: userName,
            email: userEmail,
            password: userPassword,
            role: userRole
        };

        try {
            // Atualiza a tabela de logins
            const loginResponse = await fetch(`http://localhost:8080/api/logins/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword,
                    role: userRole
                })
            });

            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                throw new Error(`Erro ao atualizar perfil do usuário: ${errorText}`);
            }

            // Atualiza o perfil do usuário
            const userResponse = await fetch(`http://localhost:8080/api/userprofiles/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!loginResponse.ok) {
                const errorText = await loginResponse.text();
                throw new Error(`Erro ao atualizar login do usuário: ${errorText}`);
            }

            alert('Usuário atualizado com sucesso!');
            userForm.reset(); // Limpa o formulário
            await fetchUsers(); // Atualiza a lista de usuários
            location.reload(); // Limpe o formulário

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro inesperado: ' + error.message);
        }
    }

    // Função para excluir jogo
    window.deleteGame = async function (id) {
        const confirmDelete = confirm('Tem certeza de que deseja excluir este jogo?');
        if (!confirmDelete) return;

        const response = await fetch(`http://localhost:8080/games/${id}`, { method: 'DELETE' });

        if (response.ok) {
            alert('Jogo excluído com sucesso!');
            await fetchGames();
        } else {
            const error = await response.text();
            alert('Erro ao excluir jogo: ' + error);
        }
    };

    // Função para buscar usuários
    async function fetchUsers() {
        const data = await fetchData('http://localhost:8080/api/userprofiles');
        if (data) {
            updateUsersTable(data);
        }
    }

    // Função para atualizar um usuário
    async function updateUser() {
        const userId = document.querySelector('input[name="userId"]').value;
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        const userPassword = document.getElementById('userPassword').value;
        const userRole = document.getElementById('userRole').value.toUpperCase(); // Ajusta para maiúsculas

        if (!userId || !userName || !userEmail || !userPassword || !userRole) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        const userData = {
            name: userName,
            email: userEmail,
            password: userPassword,
            role: userRole
        };

        try {
            const response = await fetch(`http://localhost:8080/api/userprofiles/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert('Usuário atualizado com sucesso!');
            await fetchUsers(); // Atualize a lista de usuários
            userForm.reset(); // Limpe o formulário

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro inesperado: ' + error.message);
        }
    }


    // Função para adicionar um novo usuário
    async function addUser() {
        const userData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            password: document.getElementById('userPassword').value,
            role: document.getElementById('userRole').value
        };

        try {
            const response = await fetch('http://localhost:8080/api/userprofiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('Usuário adicionado com sucesso!');
                fetchUsers(); // Atualize a lista de usuários
                userForm.reset(); // Limpe o formulário
            } else {
                const error = await response.text();
                alert('Erro ao adicionar usuário: ' + error);
            }
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
            alert('Erro inesperado: ' + error.message);
        }
    }

    // Função para atualizar a tabela de usuários
    function updateUsersTable(users) {
        usersTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <div class="action-links">
                    <a href="#" class="edit" onclick="editUser(${user.id}); return false;">Editar</a>
                    <a href="#" class="delete" onclick="deleteUser(${user.id}); return false;">Deletar</a>
                </div>
            </td>`;
            usersTableBody.appendChild(row);
        });
    }

    // Função para carregar um usuário para edição
    window.editUser = async function (id) {
        const user = await fetchData(`http://localhost:8080/api/userprofiles/${id}`);
        if (user) {
            const userIdInput = document.querySelector('input[name="userId"]');
            const userNameInput = document.getElementById('userName');
            const userEmailInput = document.getElementById('userEmail');
            const userPasswordInput = document.getElementById('userPassword');
            const userRoleSelect = document.getElementById('userRole');

            // Verifica se todos os elementos estão presentes no DOM
            if (userIdInput && userNameInput && userEmailInput && userPasswordInput && userRoleSelect) {
                userIdInput.value = user.id;
                userNameInput.value = user.name;
                userEmailInput.value = user.email;
                userPasswordInput.value = ''; // Deixe a senha em branco para que o usuário possa definir uma nova
                userRoleSelect.value = user.role;
                isEditingUser = true;
            } else {
                console.error('Um ou mais elementos não foram encontrados no DOM.');
            }
        }
    };


    // Função para excluir usuário
    window.deleteUser = async function (id) {
        const confirmDelete = confirm('Tem certeza de que deseja excluir este usuário?');
        if (!confirmDelete) return;

        try {
            await fetch(`http://localhost:8080/api/userprofiles/${id}`, { method: 'DELETE' });
            alert('Usuário excluído com sucesso!');
            fetchUsers(); // Atualize a lista de usuários
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            alert('Erro inesperado: ' + error.message);
        }
    };




    // Evento para o botão de busca
    searchButton.addEventListener('click', () => {
        const query = searchQueryInput.value;
        const categoryId = categoryFilter.value;
        fetchGames(query, categoryId);
    });

    // Evento para o botão de filtro
    filterButton.addEventListener('click', () => {
        const categoryId = categoryFilter.value;
        fetchGames('', categoryId);
    });

    // Evento para o envio do formulário de jogo
    gameForm.addEventListener('submit', event => {
        event.preventDefault();
        if (isEditingGame) {
            updateGame();
        } else {
            addGame();
        }
    });

    // Evento para o envio do formulário de usuário
    userForm.addEventListener('submit', event => {
        event.preventDefault();
        if (isEditingUser) {
            updateUser();
        } else {
            addUser();
        }
    });

    // Carregando dados iniciais
    loadInitialData();
    fetchUsers(); // Carregue usuários na inicialização
});


document.addEventListener('DOMContentLoaded', () => {
    const ordersTableBody = document.querySelector('#ordersTable tbody');

    // Função para fazer fetch e manipular resposta
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // Função para buscar e exibir o histórico de pedidos
    async function fetchPurchaseHistory() {
        const data = await fetchData('http://localhost:8080/purchase-history/all');
        if (data) {
            updateOrdersTable(data);
        }
    }

    // Função para atualizar a tabela de histórico de pedidos
    function updateOrdersTable(purchaseHistory) {
        ordersTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

        purchaseHistory.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.userProfileId}</td>
                <td>${order.gameName}</td>
                <td>R$ ${order.gamePrice.toFixed(2)}</td>
                <td>${order.deliveryStatus}</td>
            `;
            ordersTableBody.appendChild(row);
        });
    }

    // Carregando dados iniciais
    fetchPurchaseHistory();
});
