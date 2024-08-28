package br.com.atma.repository;

import br.com.atma.model.PurchaseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseHistoryRepository extends JpaRepository<PurchaseHistory, Long> {
    List<PurchaseHistory> findByUserProfileId(Long userProfileId);
}
