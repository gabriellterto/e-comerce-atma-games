document.addEventListener('DOMContentLoaded', () => {
    const formPesquisa = document.getElementById('form-pesquisa');
    

    // Função para carregar resultados da pesquisa e redirecionar para a página de detalhes
    function carregarResultadosPesquisa(query) {
        fetch(`http://localhost:8080/games/pesquisa?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    // Redireciona para a página de detalhes do primeiro jogo encontrado
                    window.location.href = `http://localhost:8080/detalhes?id=${data[0].id}`;
                } else {
                    alert('Nenhum jogo encontrado.');
                }
            })
            .catch(error => console.error('Erro ao carregar resultados da pesquisa:', error));
    }
    // Adicionar evento para pesquisa
    formPesquisa.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = formPesquisa.querySelector('input[name="search"]').value;
        carregarResultadosPesquisa(query);
    });
});
