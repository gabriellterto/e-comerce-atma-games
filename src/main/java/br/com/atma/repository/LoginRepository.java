package br.com.atma.repository;

import br.com.atma.model.Login;
import br.com.atma.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoginRepository extends JpaRepository<Login, Long> {
    Optional<Login> findByEmail(String email);

    Login findByUserProfile(UserProfile userProfile);
}
