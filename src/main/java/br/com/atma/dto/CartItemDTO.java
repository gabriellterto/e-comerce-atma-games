    package br.com.atma.dto;

    import java.math.BigDecimal;

    public class CartItemDTO {
        private Long id;
        private Long gameId;
        private String gameName;
        private BigDecimal gamePrice;
        private String gameImage;
        private int quantity;

        public CartItemDTO(Long id, Long gameId, String gameName, BigDecimal gamePrice, String gameImage, int quantity) {
            this.id = id;
            this.gameId = gameId;
            this.gameName = gameName;
            this.gamePrice = gamePrice;
            this.gameImage = gameImage;
            this.quantity = quantity;
        }

       
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getGameId() { return gameId; }
        public void setGameId(Long gameId) { this.gameId = gameId; }

        public String getGameName() { return gameName; }
        public void setGameName(String gameName) { this.gameName = gameName; }

        public BigDecimal getGamePrice() { return gamePrice; }
        public void setGamePrice(BigDecimal gamePrice) { this.gamePrice = gamePrice; }

        public String getGameImage() { return gameImage; }
        public void setGameImage(String gameImage) { this.gameImage = gameImage; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
