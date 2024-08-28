package br.com.atma.Service;

import br.com.atma.dto.LoginDTO;
import br.com.atma.model.Login;
import br.com.atma.repository.LoginRepository;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    public List<LoginDTO> getAllLogins() {
        return loginRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<LoginDTO> getLoginById(Long id) {
        return loginRepository.findById(id).map(this::convertToDTO);
    }

    public LoginDTO createLogin(LoginDTO loginDTO) {
        Login login = convertToEntity(loginDTO);
        login.setTimestamp(LocalDateTime.now());
        login = loginRepository.save(login);
        return convertToDTO(login);
    }

    public LoginDTO updateLogin(Long id, LoginDTO loginDetails) {
        Login login = loginRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Login not found for this id :: " + id));

        login.setEmail(loginDetails.getEmail());
        login.setPassword(loginDetails.getPassword());
        login.setTimestamp(LocalDateTime.now());
        login.setSuccessful(loginDetails.isSuccessful());
        login.setRole(loginDetails.getRole());

        final Login updatedLogin = loginRepository.save(login);
        return convertToDTO(updatedLogin);
    }

    public void deleteLogin(Long id) {
        Login login = loginRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Login not found for this id :: " + id));
        loginRepository.delete(login);
    }

    public LoginDTO authenticateUser(LoginDTO loginDTO) {
        Optional<Login> userOptional = loginRepository.findByEmail(loginDTO.getEmail());
        if (userOptional.isPresent()) {
            Login user = userOptional.get();
            if (user.getPassword().equals(loginDTO.getPassword())) {
                return convertToDTO(user);
            }
        }
        return null;
    }

    public boolean checkPassword(String email, String password) {
        Optional<Login> userOptional = loginRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            Login user = userOptional.get();
            return user.getPassword().equals(password);
        }
        return false;
    }

    private LoginDTO convertToDTO(Login login) {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setId(login.getId());
        loginDTO.setEmail(login.getEmail());
        loginDTO.setPassword(login.getPassword());
        loginDTO.setTimestamp(login.getTimestamp());
        loginDTO.setSuccessful(login.isSuccessful());
        loginDTO.setRole(login.getRole());
        return loginDTO;
    }

    private Login convertToEntity(LoginDTO loginDTO) {
        Login login = new Login();
        login.setId(loginDTO.getId());
        login.setEmail(loginDTO.getEmail());
        login.setPassword(loginDTO.getPassword());
        login.setTimestamp(loginDTO.getTimestamp());
        login.setSuccessful(loginDTO.isSuccessful());
        login.setRole(loginDTO.getRole());
        return login;
    }
}
