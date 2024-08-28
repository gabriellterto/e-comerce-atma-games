package br.com.atma.controller;

import br.com.atma.dto.PurchaseHistoryDTO;
import br.com.atma.model.PurchaseHistory;
import br.com.atma.Service.PurchaseHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/purchase-history")
public class PurchaseHistoryController {

    @Autowired
    private PurchaseHistoryService purchaseHistoryService;

    @GetMapping("/all")
    public List<PurchaseHistoryDTO> getAllPurchaseHistories() {
        List<PurchaseHistory> purchaseHistories = purchaseHistoryService.findAll();
        return purchaseHistories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    
    @GetMapping("/user/{userId}")
    public List<PurchaseHistoryDTO> getPurchaseHistoriesByUserId(@PathVariable Long userId) {
        List<PurchaseHistory> purchaseHistories = purchaseHistoryService.findByUserId(userId);
        return purchaseHistories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PurchaseHistoryDTO convertToDTO(PurchaseHistory purchaseHistory) {
        PurchaseHistoryDTO dto = new PurchaseHistoryDTO();
        dto.setId(purchaseHistory.getId());
        dto.setUserProfileId(purchaseHistory.getUserProfile().getId());
        dto.setGameId(purchaseHistory.getGameId());
        dto.setGameImage(purchaseHistory.getGameImage());
        dto.setGameName(purchaseHistory.getGameName());
        dto.setGamePrice(purchaseHistory.getGamePrice());
        dto.setQuantity(purchaseHistory.getQuantity());
        dto.setDeliveryStatus(purchaseHistory.getDeliveryStatus());
        return dto;
    }
}