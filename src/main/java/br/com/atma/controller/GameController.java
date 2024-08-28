package br.com.atma.controller;

import br.com.atma.Service.GameService;
import br.com.atma.dto.GameDTO;
import br.com.atma.model.Game;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameDTO>> getAllGames() {
        List<GameDTO> gameDtos = gameService.getAllGames();
        return new ResponseEntity<>(gameDtos, HttpStatus.OK);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<GameDTO> createGame(@RequestBody GameDTO gameDto) {
        try {
            GameDTO createdGame = gameService.saveGame(gameDto);
            return new ResponseEntity<>(createdGame, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<GameDTO> getGameById(@PathVariable Long gameId) {
        GameDTO gameDto = gameService.getGameById(gameId);
        if (gameDto != null) {
            return new ResponseEntity<>(gameDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/pesquisa")
    public ResponseEntity<List<GameDTO>> pesquisarJogos(@RequestParam("query") String query) {
        List<Game> jogos = gameService.pesquisarJogos(query);
        List<GameDTO> jogosDTO = jogos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(jogosDTO);
    }

    @PutMapping(value = "/{gameId}", consumes = "application/json")
    public ResponseEntity<GameDTO> updateGame(@PathVariable Long gameId, @RequestBody GameDTO gameDto) {
        try {
            GameDTO updatedGameDto = gameService.updateGame(gameId, gameDto);
            if (updatedGameDto != null) {
                return new ResponseEntity<>(updatedGameDto, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<Void> deleteGameById(@PathVariable Long gameId) {
        try {
            boolean isRemoved = gameService.deleteGameById(gameId);
            if (isRemoved) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<GameDTO>> getGamesByCategory(@PathVariable Long categoryId) {
        List<GameDTO> gameDtos = gameService.getGamesByCategory(categoryId);
        return new ResponseEntity<>(gameDtos, HttpStatus.OK);
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
        // Se houver uma propriedade CategoryDTO em GameDTO, faça a conversão aqui também
        if (game.getCategory() != null) {
            gameDTO.setCategoryId(game.getCategory().getId());
        }
        return gameDTO;
    }
}
