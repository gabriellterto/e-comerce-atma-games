package br.com.atma.controller;

import br.com.atma.Service.CartService;
import br.com.atma.dto.CartDTO;
import br.com.atma.dto.CartItemRequestDTO;
import br.com.atma.model.Cart;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/user/{userProfileId}")
    public ResponseEntity<CartDTO> getCartByUserProfileId(@PathVariable Long userProfileId) {
        CartDTO cartDTO = cartService.getCartByUserProfileId(userProfileId);
        if (cartDTO != null) {
            return ResponseEntity.ok(cartDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addGameToCart(@RequestBody CartItemRequestDTO request) {
        CartDTO cartDTO = cartService.addGameToCart(request.getUserProfileId(), request.getGameId(), request.getQuantity());
        return ResponseEntity.ok(cartDTO);
    }

    @DeleteMapping("/{userProfileId}/remove")
    public ResponseEntity<CartDTO> removeGameFromCart(@PathVariable Long userProfileId, @RequestBody CartItemRequestDTO request) {
        try {
            CartDTO cartDTO = cartService.removeGameFromCart(userProfileId, request.getGameId());
            return ResponseEntity.ok(cartDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{userProfileId}/create-preference")
    public ResponseEntity<String> createPreference(@PathVariable Long userProfileId) throws MPException, MPApiException {
        try {
            String preferenceUrl = cartService.createPreference(userProfileId);
            return ResponseEntity.ok(preferenceUrl);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Erro ao criar preferência: " + e.getMessage());
        }
    }

    @PostMapping("/{userProfileId}/save-purchase-history")
    public ResponseEntity<Void> savePurchaseHistory(@PathVariable Long userProfileId) {
        try {
            cartService.savePurchaseHistory(userProfileId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/{userProfileId}/create")
    public ResponseEntity<CartDTO> createCart(@PathVariable Long userProfileId) {
        try {
            Cart cart = cartService.createCart(userProfileId);
            CartDTO cartDTO = cartService.convertToDTO(cart);
            return new ResponseEntity<>(cartDTO, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{userProfileId}/clear-cart")
    public ResponseEntity<String> clearCart(@PathVariable Long userProfileId) {
        try {
            cartService.clearCart(userProfileId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Carrinho não encontrado para o usuário com ID " + userProfileId);
        }
    }

    @DeleteMapping("/{userProfileId}/delete-cart")
    public ResponseEntity<String> deleteCart(@PathVariable Long userProfileId) {
        try {
            cartService.deleteCart(userProfileId);
            return ResponseEntity.ok("Carrinho deletado com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Carrinho não encontrado para o usuário com ID " + userProfileId);
        }

    }



}
