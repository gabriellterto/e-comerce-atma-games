package br.com.atma.controller;

import br.com.atma.Service.UserProfileService;
import br.com.atma.dto.FavoriteGameDTO;
import br.com.atma.dto.UserProfileDTO;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/userprofiles")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping
    public List<UserProfileDTO> getAllUserProfiles() {
        return userProfileService.getAllUserProfiles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDTO> getUserProfileById(@PathVariable Long id) {
        Optional<UserProfileDTO> userProfileDTO = userProfileService.getUserProfileById(id);
        return userProfileDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserProfileDTO> createUserProfile(@RequestBody UserProfileDTO userProfileDTO) {
        UserProfileDTO createdUserProfile = userProfileService.createUserProfile(userProfileDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUserProfile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfileDTO> updateUserProfile(@PathVariable Long id, @RequestBody UserProfileDTO userProfileDTO) {
        UserProfileDTO updatedUserProfile = userProfileService.updateUserProfile(id, userProfileDTO);
        return ResponseEntity.ok(updatedUserProfile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable Long id) {
        userProfileService.deleteUserProfile(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{userId}/favoritegames")
    public ResponseEntity<FavoriteGameDTO> addFavoriteGame(@PathVariable Long userId, @RequestBody FavoriteGameDTO favoriteGameDTO) {
        FavoriteGameDTO createdFavoriteGame = userProfileService.addFavoriteGame(userId, favoriteGameDTO);
        return ResponseEntity.ok(createdFavoriteGame);
    }

    @DeleteMapping("/{userId}/favoritegames/{gameId}")
    public ResponseEntity<Void> deleteFavoriteGame(@PathVariable Long userId, @PathVariable Long gameId) {
        userProfileService.deleteFavoriteGame(userId, gameId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/favoritegames")
    public ResponseEntity<List<FavoriteGameDTO>> getFavoriteGames(@PathVariable Long userId) {
        List<FavoriteGameDTO> favoriteGames = userProfileService.getFavoriteGames(userId);
        return ResponseEntity.ok(favoriteGames);
    }
}
