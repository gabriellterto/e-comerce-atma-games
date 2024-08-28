package br.com.atma.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.atma.model.Game;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    List<Game> findByCategoryId(Long categoryId);
    List<Game> findByNameGameContainingIgnoreCase(String nameGame);
    Optional<Game> findByNameGame(String nameGame);
}
