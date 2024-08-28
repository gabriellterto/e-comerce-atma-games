document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('loginLink');
    const profileLink = document.getElementById('profileLink');
    const logoutLink = document.getElementById('logoutLink');
  
    // Simular o estado de login. Substitua isso com uma chamada real à API ou verificação de sessão
    const usuarioLogado = false; // Alterar para `true` se o usuário estiver logado
  
    if (usuarioLogado) {
      // Se o usuário estiver logado, mostrar links de perfil e logout e ocultar login
      loginLink.style.display = 'none';
      profileLink.style.display = 'block';
      logoutLink.style.display = 'block';
    } else {
      // Se o usuário não estiver logado, mostrar link de login e ocultar perfil e logout
      loginLink.style.display = 'block';
      profileLink.style.display = 'none';
      logoutLink.style.display = 'none';
    }
  
    // Event listener para redirecionar para a página de login quando o ícone de usuário for clicado
    loginLink.addEventListener('click', () => {
      window.location.href = 'http://localhost:8080/cadastro';
    });
  
    // Event listener para redirecionar para a página de logout quando o usuário clicar em "Sair"
    logoutLink.addEventListener('click', () => {
      // Aqui você pode adicionar lógica para finalizar a sessão do usuário, se necessário
      window.location.href = 'http://localhost:8080/logout';
    });
  });
  