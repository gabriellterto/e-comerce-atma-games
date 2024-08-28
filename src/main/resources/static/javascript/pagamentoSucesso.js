const userId = localStorage.getItem('userId');

// Função para fazer requisições POST
async function postRequest(url) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userProfileId: userId })
        });
        if (!response.ok) throw new Error('Falha na requisição: ' + response.statusText);
        return response;
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function deleteRequest(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userProfileId: userId })
        });
        if (!response.ok) throw new Error('Falha na requisição: ' + response.statusText);
        return response;
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para lidar com o carregamento da página
async function handlePageLoad() {
    // Mostrar o popup
    document.getElementById('popup').style.display = 'block';
    
    // Fazer as requisições na ordem
    await postRequest(`http://localhost:8080/api/cart/${userId}/save-purchase-history`);
    await deleteRequest(`http://localhost:8080/api/cart/${userId}/clear-cart`);
    
    // Habilitar o botão de voltar após as requisições
    document.getElementById('back-button').disabled = false;
}

// Adicionar evento de carregamento à janela
window.addEventListener('load', handlePageLoad);

// Redirecionar ao clicar no botão de voltar
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'http://localhost:8080/perfil'; // Substitua pela URL desejada
});
