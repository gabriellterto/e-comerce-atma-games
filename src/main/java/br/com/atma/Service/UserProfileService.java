package br.com.atma.Service;

import br.com.atma.dto.FavoriteGameDTO;
import br.com.atma.dto.LoginDTO;
import br.com.atma.dto.UserProfileDTO;
import br.com.atma.model.FavoriteGame;
import br.com.atma.model.Game;
import br.com.atma.model.Login;
import br.com.atma.model.UserProfile;
import br.com.atma.repository.FavoriteGameRepository;
import br.com.atma.repository.GameRepository;
import br.com.atma.repository.LoginRepository;
import br.com.atma.repository.UserProfileRepository;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    public void updateProfileImage(Long userId, MultipartFile file) {
       
    }

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private FavoriteGameRepository favoriteGameRepository;

    @Autowired
    private LoginService loginService;

    @Autowired
    private GameRepository gameRepository;

    public List<UserProfileDTO> getAllUserProfiles() {
        return userProfileRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserProfileDTO> getUserProfileById(Long id) {
        return userProfileRepository.findById(id).map(this::convertToDTO);
    }

    public UserProfileDTO createUserProfile(UserProfileDTO userProfileDTO) {
        UserProfile userProfile = convertToEntity(userProfileDTO);
        userProfile = userProfileRepository.save(userProfile);

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(userProfile.getEmail());
        loginDTO.setPassword(userProfile.getPassword());
        loginDTO.setTimestamp(LocalDateTime.now());
        loginDTO.setSuccessful(false);
        loginDTO.setRole(userProfile.getRole());

        loginService.createLogin(loginDTO);

        return convertToDTO(userProfile);
    }

    public UserProfileDTO updateUserProfile(Long id, UserProfileDTO userProfileDTO) {
        UserProfile userProfile = userProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile not found for this id :: " + id));

        userProfile.setName(userProfileDTO.getName());
        userProfile.setEmail(userProfileDTO.getEmail());
        userProfile.setPassword(userProfileDTO.getPassword());
        userProfile.setProfileImage(userProfileDTO.getProfileImage());
        userProfile.setRole(userProfileDTO.getRole());

        final UserProfile updatedUserProfile = userProfileRepository.save(userProfile);


        Login login = loginRepository.findByUserProfile(userProfile);
        if (login != null) {
            login.setEmail(userProfileDTO.getEmail());
            login.setPassword(userProfileDTO.getPassword());
            login.setRole(userProfileDTO.getRole());
            loginRepository.save(login);
        }

        return convertToDTO(updatedUserProfile);
    }

    public void deleteUserProfile(Long id) {
        UserProfile userProfile = userProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile not found for this id :: " + id));

        Login login = loginRepository.findByUserProfile(userProfile);
        if (login != null) {
            loginRepository.delete(login);
        }

        userProfileRepository.delete(userProfile);
    }

    public FavoriteGameDTO addFavoriteGame(Long userId, FavoriteGameDTO favoriteGameDTO) {
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile not found for this id :: " + userId));

        Game game = gameRepository.findById(favoriteGameDTO.getGameId())
                .orElseThrow(() -> new ResourceNotFoundException("Game not found for this id :: " + favoriteGameDTO.getGameId()));

        FavoriteGame favoriteGame = new FavoriteGame();
        favoriteGame.setGameName(favoriteGameDTO.getGameName());
        favoriteGame.setUserProfile(userProfile);
        favoriteGame.setGame(game); // Adicionado

        favoriteGame = favoriteGameRepository.save(favoriteGame);

        return convertToDTO(favoriteGame);
    }

    public void deleteFavoriteGame(Long userId, Long gameId) {
        FavoriteGame favoriteGame = (FavoriteGame) favoriteGameRepository.findByIdAndUserProfileId(gameId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("FavoriteGame not found for this id :: " + gameId + " and userId :: " + userId));

        favoriteGameRepository.delete(favoriteGame);
    }

    public List<FavoriteGameDTO> getFavoriteGames(Long userId) {
        List<FavoriteGame> favoriteGames = favoriteGameRepository.findByUserProfileId(userId);
        return favoriteGames.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private FavoriteGameDTO convertToDTO(FavoriteGame favoriteGame) {
        FavoriteGameDTO favoriteGameDTO = new FavoriteGameDTO();
        favoriteGameDTO.setId(favoriteGame.getId());
        favoriteGameDTO.setGameName(favoriteGame.getGameName());
        favoriteGameDTO.setGameId(favoriteGame.getGame().getId()); 
        return favoriteGameDTO;
    }

    private UserProfileDTO convertToDTO(UserProfile userProfile) {
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setId(userProfile.getId());
        userProfileDTO.setName(userProfile.getName());
        userProfileDTO.setEmail(userProfile.getEmail());
        userProfileDTO.setPassword(userProfile.getPassword()); 
        userProfileDTO.setProfileImage(userProfile.getProfileImage());
        userProfileDTO.setRole(userProfile.getRole());
        return userProfileDTO;
    }

    private UserProfile convertToEntity(UserProfileDTO userProfileDTO) {
        UserProfile userProfile = new UserProfile();
        userProfile.setId(userProfileDTO.getId());
        userProfile.setName(userProfileDTO.getName());
        userProfile.setEmail(userProfileDTO.getEmail());
        userProfile.setPassword(userProfileDTO.getPassword()); 
        userProfile.setProfileImage(userProfileDTO.getProfileImage());
        userProfile.setRole(userProfileDTO.getRole());
        return userProfile;
    }
}
