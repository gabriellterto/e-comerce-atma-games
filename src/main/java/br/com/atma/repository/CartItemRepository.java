package br.com.atma.repository;

import br.com.atma.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndGameId(Long cartId, Long gameId);
    void deleteByCartIdAndGameId(Long cartId, Long gameId);
}




