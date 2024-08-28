document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const continuarComprandoButton = document.getElementById('continuarComprando');
    const irParaPagamentoButton = document.getElementById('irParaPagamento');
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
    const userId = 1;
    if (!userId) {
        console.error('Usuário não autenticado. Redirecionando para o login...');
        window.location.href = 'http://localhost:8080/cadastro'; // Redireciona para a página de login se o userId não estiver disponível
        return;
    }

    async function fetchCart() {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/${userId}`); // Atualiza o endpoint com userId
            if (response.ok) {
                const cartData = await response.json();
                renderCart(cartData.items); // Use 'items' para obter o array de itens
            } else {
                console.error('Erro ao buscar o carrinho:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar o carrinho:', error);
        }
    }

    async function removeItemFromCart(gameId) {
        try {
            await fetch(`http://localhost:8080/api/cart/${userId}/remove`, { // Atualiza o endpoint com userId
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId }) // Envia o gameId no corpo da solicitação
            });
            fetchCart(); // Atualiza o carrinho após remover um item
        } catch (error) {
            console.error('Erro ao remover item do carrinho:', error);
        }
    }

    function renderCart(items) {
        cartItemsContainer.innerHTML = ''; // Limpa o contêiner antes de adicionar novos itens
        let total = 0;
        let quantity = 0;

        items.forEach(item => {
            total += item.gamePrice * item.quantity; // Multiplicar preço por quantidade
            quantity += item.quantity; // Contar quantidade total de itens

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.gameImage}" alt="${item.gameName}">
                <div class="item-details">
                    <h4>${item.gameName}</h4>
                    <p>Preço: R$${item.gamePrice.toFixed(2)}</p>
                    <p>Quantidade: ${item.quantity}</p>
                </div>
                <button class="remover-item" data-id="${item.gameId}">Remover</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotalElement.innerHTML = `<h3>Total: R$${total.toFixed(2)}</h3><p>Quantidade total de itens: ${quantity}</p>`;
        attachRemoveButtons();
    }

    function attachRemoveButtons() {
        document.querySelectorAll('.remover-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.getAttribute('data-id');
                removeItemFromCart(gameId);
            });
        });
    }

    async function redirectToPayment() {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/${userId}/create-preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userProfileId: userId,
                    gameId: 1, // Ajuste conforme necessário
                    quantity: 2 // Ajuste conforme necessário
                })
            });

            if (response.ok) {
                const preferenceUrl = await response.text(); // Supondo que o URL seja retornado como texto
                window.location.href = preferenceUrl; // Redireciona para o URL de pagamento
            } else {
                console.error('Erro ao criar a preferência de pagamento:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao criar a preferência de pagamento:', error);
        }
    }

    continuarComprandoButton.addEventListener('click', () => {
        window.location.href = 'http://localhost:8080/jogos';
    });

    irParaPagamentoButton.addEventListener('click', () => {
        redirectToPayment();
    });

    handleLogout();
    fetchCart(); // Certifique-se de que esta função está sendo chamada
});
