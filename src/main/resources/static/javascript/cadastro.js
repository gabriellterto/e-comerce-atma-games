document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const apiUrl = 'http://localhost:8080/api/userprofiles';
    const apiUrlLogin = 'http://localhost:8080/api/logins';
    const defaultProfileImage = '../static/img/DEFAULT.png'; // URL da imagem padrão

    async function createCart(userId) {
        try {
            const response = await fetch(`${apiUrlCart}/${userId}/create-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Erro ao criar carrinho: ${error.message}`);
            }
            console.log('Carrinho criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar carrinho:', error);
            alert('Erro ao criar carrinho.');
        }
    }

    async function registerUser(name, email, password) {
        try {
            const role = email.includes('@atma') ? 'ADMIN' : 'USER';

            const response = await fetch(`${apiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    profileImage: defaultProfileImage // Imagem de perfil padrão
                })
            });

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('authToken', user.token); // Armazena o token no localStorage
                localStorage.setItem('userId', user.id); // Armazena o userId no localStorage
                localStorage.setItem('userRole', user.role); // Armazena a role do usuário no localStorage
                if (user.role === 'ADMIN') {
                    window.location.href = 'http://localhost:8080/adm';
                } else {
                    window.location.href = 'http://localhost:8080/perfil';
                }
            } else {
                const error = await response.json();
                alert(`Erro ao registrar: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            alert('Erro ao registrar usuário.');
        }
    }

    async function authenticateUser(email, password) {
        try {
            const response = await fetch(`${apiUrlLogin}/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('authToken', user.token); // Armazena o token no localStorage
                localStorage.setItem('userId', user.id); // Armazena o userId no localStorage
                localStorage.setItem('userEmail', email); // Armazena o email do usuário
                localStorage.setItem('userRole', user.role); // Armazena a role do usuário no localStorage
                localStorage.setItem('isLoggedIn', 'true'); // Marca o usuário como logado
                if (user.role === 'ADMIN') {
                    window.location.href = 'http://localhost:8080/adm'; // Redireciona para a página de administração
                } else {
                    window.location.href = 'http://localhost:8080/perfil'; // Redireciona para a página de perfil
                }
            } else {
                const error = await response.json();
                alert(`Erro ao autenticar: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao autenticar usuário:', error);
            alert('Erro ao autenticar usuário.');
        }
    }

    function checkAuthentication() {
        const token = localStorage.getItem('authToken');
        const loginLink = document.getElementById('loginLink');
        const profileLink = document.getElementById('profileLink');
        const logoutLink = document.getElementById('logoutLink');
        const userIcon = document.getElementById('userIcon');

        if (token) {
            loginLink.style.display = 'none';
            profileLink.style.display = 'block';
            logoutLink.style.display = 'block';
            userIcon.src = '../static/img/default-profile.jpg'; // Atualize com a imagem do usuário, se disponível
        } else {
            loginLink.style.display = 'block';
            profileLink.style.display = 'none';
            logoutLink.style.display = 'none';
            userIcon.src = '../static/img/default-profile.jpg'; // Imagem padrão
        }
    }

    function initializePage() {
        checkAuthentication();

        document.getElementById('logoutLink').addEventListener('click', () => {
            localStorage.removeItem('authToken'); // Remove o token
            localStorage.removeItem('userId'); // Remove o userId
            localStorage.removeItem('userEmail'); // Remove o email do usuário
            localStorage.removeItem('userRole'); // Remove a role do usuário
            localStorage.removeItem('isLoggedIn'); // Remove a marca de login
            window.location.href = 'http://localhost:8080'; // Redireciona para a página inicial após logout
        });
    }

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        registerUser(name, email, password);
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        authenticateUser(email, password);
    });

    // Função para verificar o estado de login ao carregar a página
    window.onload = function () {
        if (localStorage.getItem('authToken')) {
            checkAuthentication(); // Atualiza a interface se estiver logado
        }
    }

    initializePage();
});
