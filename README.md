#Projeto Final proposta pela Soulcode Academy do Bootcamp em parceia com a Sankhya:

# Sistema Atma Games

## Tecnologias Utilizadas
- HTML
- CSS
- JavaScript
- Java
- MySQL/Postgres
- Spring Boot

## Página Pública

### Página Principal
- Exibição de informações sobre os jogos mais populares, lançamentos recentes, e um formulário de pesquisa para buscar jogos específicos.

## Funcionalidades (CRUDs)

### 1. Registro de Usuários
- Sistema de registro de usuários com validação de formulário, coletando nome, e-mail e senha.
- Armazenamento dos dados em um banco de dados MySQL/Postgres.

### 2. Perfis de Usuários
- Possibilidade de criar, visualizar e editar perfis de usuários.
- Os usuários podem adicionar informações básicas, jogos favoritos e histórico de compras.

### 3. Jogos
- CRUD para gerenciar o catálogo de jogos.
- Inclusão de informações detalhadas sobre cada jogo, como nome, descrição, preço, desenvolvedor, e data de lançamento.
- Os dados serão armazenados no banco de dados.

### 4. Carrinho de Compras
- Sistema para gerenciar o carrinho de compras dos usuários.
- Permitir adicionar, visualizar, editar e remover jogos do carrinho.
- O estado do carrinho será salvo no banco de dados.

### 5. Pedidos
- CRUD para gerenciar pedidos dos usuários.
- Permitir que os usuários visualizem o histórico de pedidos, detalhes do pedido e status da entrega.
- Os dados serão armazenados no banco de dados.


## Estrutura de Páginas e Funcionalidades

### 1. Página Principal
- Apresentação dos jogos mais populares e lançamentos recentes.
- Formulário de pesquisa para buscar jogos específicos.

### 2. Cadastro de Usuários
- Formulário de registro com validação (nome, e-mail, senha).
- Botões para criar, visualizar, editar e excluir usuários.

### 3. Perfis de Usuários
- Visualização e edição de perfis com informações detalhadas (nome, e-mail, jogos favoritos, histórico de compras).

### 4. Gerenciamento de Jogos
- Formulário para criar e editar jogos (nome, descrição, preço, desenvolvedor, data de lançamento).
- Lista de jogos com opções de visualização, edição e exclusão.

### 5. Carrinho de Compras
- Adicionar jogos ao carrinho de compras.
- Visualização e edição dos jogos no carrinho.
- Opção para remover jogos do carrinho.

### 6. Gerenciamento de Pedidos
- Visualização do histórico de pedidos dos usuários.
- Detalhes do pedido e status da entrega.

### 7. Login e Autenticação
- Formulário de login simples para usuários.

### 8. Processamento de Pagamentos
- Integração com API de pagamento para processar transações.

---
## Equipe de Desenvolvimento
* **FRONT-END**: Anajara Lucas e Gabriel Terto - logo feito por Neto Russo.
* **BACK-END**: Thiago Ariça e Denys Andrade


#Estrutura do Projeto back-end:

-src/
-└── main/
-└── java/
-└── com/
-└── atma/
*├── controller/
*│ ├── HomeController.java
*│ ├── UserController.java
*│ ├── ProfileController.java
*│ ├── GameController.java
*│ ├── CartController.java
*│ ├── OrderController.java
*│ ├── AuthController.java
*│ └── PaymentController.java
*├── service/
*│ ├── GameService.java
*│ ├── UserService.java
*│ ├── ProfileService.java
*│ ├── CartService.java
*│ ├── OrderService.java
*│ ├── AuthService.java
*│ └── PaymentService.java
*├── repository/
*│ ├── GameRepository.java
*│ ├── UserRepository.java
*│ ├── ProfileRepository.java
*│ ├── CartRepository.java
*│ └── OrderRepository.java
*├── model/
*│ ├── Game.java
*│ ├── User.java
*│ ├── UserProfile.java
*│ ├── Cart.java
*│ ├── CartItem.java
*│ ├── Order.java
*│ └── PaymentDetails.java
*└── AtmaApplication.java '''

## Estrutura do Projeto

### Esquema Front-end: 
`atma-frontend/
├── index.html
├── css/
│ └── style.css
└── js/
├── script.js
├── cadastro.js
├── carrinho.js
├── adm.js
├── order.js
└── auth.js`



## Dependências Spring Boot:

* **Versão Java**: 21
* **SpringWeb**: para construir aplicações web
* **SpringDataJPA**: para trabalhar com banco de dados
* **SpringSecurity**: para autenticação e autorização
* **PostgreSQL Driver**: para conectar ao DB
* **Spring Boot DevTools**: IntelliJ ou VSCode

## Notes GIT:

```sh
git add .

NOTES GIT: git add .
# Ou
git reset --hard
# Ou
git clean -f -d

git pull origin main --allow-unrelated-histories


