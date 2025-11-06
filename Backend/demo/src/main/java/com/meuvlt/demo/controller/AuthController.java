package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.dto.UsuarioCreateDTO;
import com.meuvlt.demo.models.dto.UsuarioResponseDTO;
import com.meuvlt.demo.service.JwtService;
import com.meuvlt.demo.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UsuarioCreateDTO dto) {
        try {
            UsuarioResponseDTO novoUsuario = usuarioService.criarUsuario(dto);
            return ResponseEntity.ok(novoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro interno do servidor"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String senha = loginData.get("senha");

            String token = usuarioService.login(email, senha);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "type", "Bearer",
                    "message", "Login bem-sucedido!"
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro interno do servidor"));
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            boolean isValid = JwtService.validateToken(token, user);

            if (isValid) {
                String email = JwtService.extractUsername(token);
                return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "email", email,
                        "message", "Token válido"
                ));
            } else {
                return ResponseEntity.ok(Map.of("valid", false, "message", "Token inválido"));
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
