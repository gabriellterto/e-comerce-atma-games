package br.com.atma.Service;

import br.com.atma.dto.GameDTO;
import br.com.atma.model.Category;
import br.com.atma.model.Game;
import br.com.atma.repository.CategoryRepository;
import br.com.atma.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<GameDTO> getAllGames() {
        List<Game> games = gameRepository.findAll();
        return games.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public GameDTO getGameById(Long gameId) {
        Optional<Game> game = gameRepository.findById(gameId);
        return game.map(this::convertToDTO).orElse(null);
    }

    public GameDTO saveGame(GameDTO gameDto) {
        Game game = convertToEntity(gameDto);
        Game savedGame = gameRepository.save(game);
        return convertToDTO(savedGame);
    }

    public GameDTO updateGame(Long gameId, GameDTO gameDto) {
        if (gameRepository.existsById(gameId)) {
            Game game = convertToEntity(gameDto);
            game.setId(gameId);
            Game updatedGame = gameRepository.save(game);
            return convertToDTO(updatedGame);
        }
        return null;
    }

    public boolean deleteGameById(Long gameId) {
        if (gameRepository.existsById(gameId)) {
            gameRepository.deleteById(gameId);
            return true;
        }
        return false;
    }

    public List<GameDTO> getGamesByCategory(Long categoryId) {
        List<Game> games = gameRepository.findByCategoryId(categoryId);
        return games.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<Game> pesquisarJogos(String query) {
        return gameRepository.findByNameGameContainingIgnoreCase(query);
    }

    private GameDTO convertToDTO(Game game) {
        GameDTO gameDTO = new GameDTO();
        gameDTO.setId(game.getId());
        gameDTO.setNameGame(game.getNameGame());
        gameDTO.setDescription(game.getDescription());
        gameDTO.setDeveloper(game.getDeveloper());
        gameDTO.setPublisher(game.getPublisher());
        gameDTO.setGenre(game.getGenre());
        gameDTO.setPrice(game.getPrice());
        gameDTO.setGameImage(game.getGameImage());
        gameDTO.setReleaseDate(game.getReleaseDate());
        if (game.getCategory() != null) {
            gameDTO.setCategoryId(game.getCategory().getId());
        }
        return gameDTO;
    }

    private Game convertToEntity(GameDTO gameDTO) {
        Game game = new Game();
        game.setId(gameDTO.getId());
        game.setNameGame(gameDTO.getNameGame());
        game.setDescription(gameDTO.getDescription());
        game.setDeveloper(gameDTO.getDeveloper());
        game.setPublisher(gameDTO.getPublisher());
        game.setGenre(gameDTO.getGenre());
        game.setPrice(gameDTO.getPrice());
        game.setGameImage(gameDTO.getGameImage());
        game.setReleaseDate(gameDTO.getReleaseDate());
        if (gameDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(gameDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
            game.setCategory(category);
        }
        return game;
    }
}
