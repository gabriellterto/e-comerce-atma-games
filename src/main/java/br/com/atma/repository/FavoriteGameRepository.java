package br.com.atma.repository;

import br.com.atma.model.FavoriteGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteGameRepository extends JpaRepository<FavoriteGame, Long> {

    Optional<Object> findByIdAndUserProfileId(Long gameId, Long userId);

    List<FavoriteGame> findByUserProfileId(Long userId);
}
