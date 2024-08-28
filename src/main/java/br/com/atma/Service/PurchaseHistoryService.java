package br.com.atma.Service;

import br.com.atma.model.PurchaseHistory;
import br.com.atma.repository.PurchaseHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseHistoryService {

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    public PurchaseHistory save(PurchaseHistory purchaseHistory) {
        return purchaseHistoryRepository.save(purchaseHistory);
    }

    public List<PurchaseHistory> findAll() {
        return purchaseHistoryRepository.findAll();
    }

    public List<PurchaseHistory> findByUserId(Long userId) {
        return purchaseHistoryRepository.findByUserProfileId(userId);
    }
}

