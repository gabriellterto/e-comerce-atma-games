// Função para mostrar a seção apropriada com base no método de pagamento selecionado
function showPaymentDetails() {
      const paymentMethod = document.getElementById('paymentMethod').value;
      const sections = ['creditCardDetails', 'debitCardDetails', 'boletoDetails', 'pixDetails'];
      
      // Oculta todas as seções
      sections.forEach(section => {
          document.getElementById(section).style.display = 'none';
      });
  
      // Exibe a seção correspondente
      if (paymentMethod) {
          document.getElementById(`${paymentMethod}Details`).style.display = 'block';
      }
  }
  
  // Configura o evento para mostrar os detalhes de pagamento apropriados quando o método de pagamento é alterado
  document.getElementById('paymentMethod').addEventListener('change', showPaymentDetails);
  
  // Função para enviar o formulário de pagamento
  async function submitPaymentForm(event) {
      event.preventDefault(); // Impede o envio padrão do formulário
  
      const form = document.getElementById('paymentForm');
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      // Ajusta os dados conforme necessário para o backend
      const paymentData = {
          method: data.paymentMethod,
          cardNumber: data.cardNumber || '',
          cardName: data.cardName || '',
          expiryDate: data.expiryDate || '',
          cvv: data.cvv || '',
          installments: data.installments || '',
          debitCardNumber: data.debitCardNumber || '',
          debitCardName: data.debitCardName || '',
          boletoName: data.boletoName || '',
          boletoEmail: data.boletoEmail || '',
          pixKey: data.pixKey || ''
      };
  
      try {
          // Substitua 'http://localhost:8080/api/pagamento' pela URL da sua API
          const response = await fetch('http://localhost:8080/api/pagamento', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(paymentData)
          });
  
          const result = await response.json();
  
          if (response.ok) {
              document.getElementById('paymentResponse').innerHTML = `<div class="alert alert-success">${result.message}</div>`;
              // Redirecionar ou atualizar o histórico de compras do usuário, se necessário
          } else {
              document.getElementById('paymentResponse').innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
          }
      } catch (error) {
          document.getElementById('paymentResponse').innerHTML = `<div class="alert alert-danger">Erro ao processar o pagamento. Tente novamente.</div>`;
      }
  }
  
  // Configura o evento para enviar o formulário quando o botão de pagamento for clicado
  document.getElementById('paymentForm').addEventListener('submit', submitPaymentForm);
  

//   ORIENTAÇÕES:
//   URL da API: Atualize a URL http://localhost:8080/api/pagamento com a URL real da sua API de pagamento.

// Estrutura dos Dados: Garanta que a estrutura dos dados enviados (paymentData) corresponda ao que o backend espera. Ajuste as propriedades conforme necessário.

// Tratamento de Respostas: O código lida com a resposta do servidor e exibe mensagens de sucesso ou erro. Verifique como o backend envia as respostas e ajuste conforme necessário.

// Histórico de Compras: O backend deve gerenciar o histórico de compras e o estado do carrinho. Certifique-se de que o backend atualize esses registros conforme o necessário após o pagamento.