package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.Usuario;
import com.meuvlt.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String senha = loginData.get("senha");

        boolean success = userService.login(email, senha);

        if (success) {
            return "Login bem-sucedido!";
        }
        return "Credenciais inválidas!";
    }

}
