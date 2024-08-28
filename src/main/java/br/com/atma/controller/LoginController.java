package br.com.atma.controller;

import br.com.atma.Service.LoginService;
import br.com.atma.dto.LoginDTO;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logins")
public class LoginController {

    @Autowired
    private LoginService loginService; 

    @GetMapping
    public List<LoginDTO> getAllLogins() {
        return loginService.getAllLogins();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoginDTO> getLoginById(@PathVariable Long id) {
        LoginDTO loginDTO = loginService.getLoginById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Login not found for this id :: " + id));
        return ResponseEntity.ok().body(loginDTO);
    }

    @PostMapping
    public LoginDTO createLogin(@RequestBody LoginDTO loginDTO) {
        return loginService.createLogin(loginDTO);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<LoginDTO> authenticateUser(@RequestBody LoginDTO loginDTO) {
        // Lógica de autenticação aqui
        LoginDTO authenticatedUser = loginService.authenticateUser(loginDTO);
        if (authenticatedUser != null) {
            return ResponseEntity.ok(authenticatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/check-password")
    public ResponseEntity<Map<String, Boolean>> checkPassword(@RequestBody LoginDTO loginDTO) {
        boolean isValid = loginService.checkPassword(loginDTO.getEmail(), loginDTO.getPassword());
        Map<String, Boolean> response = new HashMap<>();
        response.put("isValid", isValid);
        return isValid ? ResponseEntity.ok(response) : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoginDTO> updateLogin(@PathVariable Long id, @RequestBody LoginDTO loginDetails) {
        LoginDTO updatedLoginDTO = loginService.updateLogin(id, loginDetails);
        return ResponseEntity.ok(updatedLoginDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLogin(@PathVariable Long id) {
        loginService.deleteLogin(id);
        return ResponseEntity.noContent().build();
    }
}
