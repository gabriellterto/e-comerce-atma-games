package br.com.atma.Service;

import br.com.atma.dto.CartDTO;
import br.com.atma.dto.CartItemDTO;
import br.com.atma.model.*;
import br.com.atma.repository.CartItemRepository;
import br.com.atma.repository.CartRepository;
import br.com.atma.repository.GameRepository;
import br.com.atma.repository.UserProfileRepository;
import com.mercadopago.*;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.*;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private PurchaseHistoryService purchaseHistoryService;

    public CartDTO getCartByUserProfileId(Long userProfileId) {
        Cart cart = cartRepository.findByUserProfileId(userProfileId).orElse(null);
        return cart != null ? convertToDTO(cart) : null;
    }

    @Transactional
    public CartDTO addGameToCart(Long userProfileId, Long gameId, int quantity) {
        Cart cart = cartRepository.findByUserProfileId(userProfileId).orElseGet(() -> createCart(userProfileId));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Jogo não encontrado com ID " + gameId));

        CartItem existingItem = cartItemRepository.findByCartIdAndGameId(cart.getId(), gameId).orElse(null);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setGame(game);
            newItem.setQuantity(quantity);
            cartItemRepository.save(newItem);
        }

        return convertToDTO(cart);
    }

    public CartDTO convertToDTO(Cart cart) {
        List<CartItemDTO> items = cart.getItems().stream().map(item -> {
            Game game = item.getGame();
            return new CartItemDTO(item.getId(), game.getId(), game.getNameGame(), BigDecimal.valueOf(game.getPrice()), game.getGameImage(), item.getQuantity());
        }).collect(Collectors.toList());
        return new CartDTO(cart.getId(), cart.getUserProfile().getId(),items);
        }


    @Transactional
    public Cart createCart(Long userProfileId) {
        Cart cart = new Cart();
        UserProfile userProfile = userProfileRepository.findById(userProfileId).orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID " + userProfileId));
        cart.setUserProfile(userProfile);
        return cartRepository.save(cart);
    }

    @Transactional
    public CartDTO removeGameFromCart(Long userProfileId, Long gameId) {
        Cart cart = cartRepository.findByUserProfileId(userProfileId).orElseThrow(() -> new RuntimeException("Carrinho não encontrado para o usuário com ID " + userProfileId));
        CartItem cartItem = cartItemRepository.findByCartIdAndGameId(cart.getId(), gameId).orElseThrow(() -> new RuntimeException("Item de carrinho não encontrado para o jogo com ID " + gameId));

        cartItemRepository.delete(cartItem);
        cartItemRepository.flush();

        return convertToDTO(cart);
    }

    @Transactional
    public void deleteCart(Long userProfileId) {
        Cart cart = cartRepository.findByUserProfileId(userProfileId)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado para o usuário com ID " + userProfileId));

        cartRepository.delete(cart);
    }


    public String createPreference(Long userProfileId) throws MPException, MPApiException {
        MercadoPagoConfig.setAccessToken("TEST-6505548037495608-072312-ad4842cee5c8b45ca7ece5bbafb46314-838073714");

        Cart cart = cartRepository.findByUserProfileId(userProfileId).orElseThrow(() -> new RuntimeException("Carrinho não encontrado para o usuário com ID " + userProfileId));

        List<PreferenceItemRequest> items = cart.getItems().stream().map(cartItem -> {
            Game game = cartItem.getGame();
            return PreferenceItemRequest.builder()
                    .id(game.getId().toString())
                    .title(game.getNameGame())
                    .description(game.getDescription())
                    .pictureUrl(game.getGameImage())
                    .categoryId("games")
                    .quantity(cartItem.getQuantity())
                    .currencyId("BRL")
                    .unitPrice(BigDecimal.valueOf(game.getPrice()))
                    .build();
        }).collect(Collectors.toList());

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(PreferenceBackUrlsRequest.builder()
                        .success("http://localhost:8080/pagamentoSucesso")
                        .failure("http://localhost:8080/carrinho")
                        .pending("http://localhost:8080/payment/pending")
                        .build())
                .autoReturn("approved")
                .build();

        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);

        return preference.getInitPoint();
    }

    @Transactional
    public void clearCart(Long userProfileId) {
        Cart cart = cartRepository.findByUserProfileId(userProfileId)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado para o usuário com ID " + userProfileId));

        cartItemRepository.deleteAll(cart.getItems());
        cartItemRepository.flush();

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public void savePurchaseHistory(Long userProfileId) {
        Cart cart = cartRepository.findByUserProfileId(userProfileId).orElseThrow(() -> new RuntimeException("Carrinho não encontrado para o usuário com ID " + userProfileId));
        for (CartItem cartItem : cart.getItems()) {
            PurchaseHistory purchaseHistory = new PurchaseHistory();
            UserProfile userProfile = userProfileRepository.findById(userProfileId).orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID " + userProfileId));
            purchaseHistory.setUserProfile(userProfile);
            purchaseHistory.setGameId(cartItem.getGame().getId());
            purchaseHistory.setGameName(cartItem.getGame().getNameGame());
            purchaseHistory.setGamePrice(BigDecimal.valueOf(cartItem.getGame().getPrice()));
            purchaseHistory.setGameImage(cartItem.getGame().getGameImage());
            purchaseHistory.setQuantity(cartItem.getQuantity());
            purchaseHistoryService.save(purchaseHistory);
        }
    }
}
