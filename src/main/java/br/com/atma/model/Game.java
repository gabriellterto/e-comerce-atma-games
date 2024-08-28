package br.com.atma.model;

import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameGame;
    private String description;
    private String developer;
    private String publisher;
    private String genre;
    private Double price;
    private String gameImage;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate releaseDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    public Game() {
        LocalDate now = LocalDate.now();


    }

    public Game(Long id, String nameGame, String description, String developer, String publisher, String genre, double price, String gameImage, LocalDate releaseDate, Category category) {
        this.id = id;
        this.nameGame = nameGame;
        this.description = description;
        this.developer = developer;
        this.publisher = publisher;
        this.genre = genre;
        this.price = price;
        this.gameImage = gameImage;
        this.releaseDate = LocalDate.parse(releaseDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        this.category = category;


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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}