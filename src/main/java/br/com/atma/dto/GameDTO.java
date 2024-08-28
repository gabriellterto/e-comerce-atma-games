package br.com.atma.dto;

import br.com.atma.model.Game;


import java.time.LocalDate;


public class GameDTO {

    private Long id;
    private String nameGame;
    private String description;
    private String developer;
    private String publisher;
    private String genre;
    private double price;
    private String gameImage;

    private LocalDate releaseDate;
    private Long categoryId;

    public GameDTO() {
        this.releaseDate = LocalDate.now();

    }

    public GameDTO(Game game) {
        this.id = game.getId();
        this.nameGame = game.getNameGame();
        this.description = game.getDescription();
        this.developer = game.getDeveloper();
        this.publisher = game.getPublisher();
        this.genre = game.getGenre();
        this.price = game.getPrice();
        this.gameImage = game.getGameImage();
        this.releaseDate =  game.getReleaseDate();
        this.categoryId = (game.getCategory() != null) ? game.getCategory().getId() : null;
    }

   
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameGame() {
        return nameGame;
    }

    public void setNameGame(String nameGame) {
        this.nameGame = nameGame;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeveloper() {
        return developer;
    }

    public void setDeveloper(String developer) {
        this.developer = developer;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getGameImage() {
        return gameImage;
    }

    public void setGameImage(String gameImage) {
        this.gameImage = gameImage;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
