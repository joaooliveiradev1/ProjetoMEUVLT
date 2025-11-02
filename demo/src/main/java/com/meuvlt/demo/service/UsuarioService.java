package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Usuario;
import com.meuvlt.demo.models.dto.UsuarioCreateDTO;
import com.meuvlt.demo.models.dto.UsuarioDTO;
import com.meuvlt.demo.models.dto.UsuarioResponseDTO;
import com.meuvlt.demo.models.enums.TipoUsuario;
import com.meuvlt.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponseDTO criarUsuario(UsuarioCreateDTO dto) {

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado!");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(UsuarioCreateDTO.getSenha()));
        usuario.setTipo(dto.getTipo() != null ? dto.getTipo() : TipoUsuario.Passageiro);

        Usuario novo = usuarioRepository.save(usuario);

        return novo.toResponseDTO(novo.getTipo() == TipoUsuario.Condutor);
    }

    public List<UsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(Usuario::toDTO)
                .toList();
    }

    public UsuarioResponseDTO atualizarUsuario(int id, UsuarioCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());

        if (UsuarioCreateDTO.getSenha() != null && !UsuarioCreateDTO.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(UsuarioCreateDTO.getSenha()));
        }

        if (dto.getTipo() != null) {
            usuario.setTipo(dto.getTipo());
        }

        usuarioRepository.save(usuario);
        return usuario.toResponseDTO(usuario.getTipo() == TipoUsuario.Condutor);
    }

    public void deletarUsuario(int id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }

        usuarioRepository.deleteById(id);
    }

    public String login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }

        // Gera o token JWT
        UserDetails userDetails = this.loadUserByUsername(email);
        return jwtService.generateToken(userDetails);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return org.springframework.security.core.userdetails.User
                .withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities(usuario.getTipo().name())
                .build();
    }
}
