package br.com.atma.dto;

import java.util.List;

public class CartDTO {
    private Long id;
    private Long userProfileId;
    private List<CartItemDTO> items;

    public CartDTO(Long id, Long userProfileId, List<CartItemDTO> items) {
        this.id = id;
        this.userProfileId = userProfileId;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserProfileId() {
        return userProfileId;
    }

    public void setUserProfileId(Long userProfileId) {
        this.userProfileId = userProfileId;
    }

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }
}
