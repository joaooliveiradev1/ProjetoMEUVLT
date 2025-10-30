package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Usuario;
import com.meuvlt.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Usuario register(Usuario user) {
        user.setSenha(passwordEncoder.encode(user.getSenha()));
        return usuarioRepository.save(user);
    }

    public boolean login(String email, String senha) {
        Optional<Usuario> user = usuarioRepository.findByEmail(email);

        if (user.isEmpty()) return false;

        return passwordEncoder.matches(senha, user.get().getSenha());
    }
}
