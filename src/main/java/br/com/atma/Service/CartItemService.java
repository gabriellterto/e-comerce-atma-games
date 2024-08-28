package br.com.atma.Service;

import br.com.atma.model.Cart;
import br.com.atma.model.CartItem;
import br.com.atma.model.Game;
import br.com.atma.repository.CartItemRepository;
import br.com.atma.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private GameRepository gameRepository;

    @Transactional
    public CartItem addItemToCart(Cart cart, Game game, int quantity) {
        CartItem existingItem = cartItemRepository.findByCartIdAndGameId(cart.getId(), game.getId())
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setGame(game);
            newItem.setQuantity(quantity);
            return cartItemRepository.save(newItem);
        }
    }


    @Transactional
    public void removeItemFromCart(Cart cart, Game game) {
        CartItem itemToRemove = cartItemRepository.findByCartIdAndGameId(cart.getId(), game.getId())
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cartItemRepository.delete(itemToRemove);
    }


    public CartItem getCartItemById(Long id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));
    }
}

