package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Usuario;
import com.meuvlt.demo.models.dto.UsuarioCreateDTO;
import com.meuvlt.demo.models.dto.UsuarioDTO;
import com.meuvlt.demo.models.enums.TipoUsuario;
import com.meuvlt.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ CREATE - Criar usuário
    public UsuarioDTO criarUsuario(UsuarioCreateDTO dto) {
        // Validar se email já existe
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado: " + dto.getEmail());
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setTipo(dto.getTipo());

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return usuarioSalvo.toDTO();
    }

    // ✅ READ - Buscar por ID
    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        return usuario.toDTO();
    }

    // ✅ READ - Buscar por Email
    public UsuarioDTO buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com email: " + email));
        return usuario.toDTO();
    }

    // ✅ READ - Listar todos
    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(Usuario::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ READ - Listar por tipo
    public List<UsuarioDTO> listarPorTipo(TipoUsuario tipo) {
        return usuarioRepository.findByTipo(tipo)
                .stream()
                .map(Usuario::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ DELETE - Deletar usuário
    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // ✅ AUTENTICAÇÃO - Registro
    public Usuario register(Usuario user) {
        // Verificar se email já existe
        if (usuarioRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email já cadastrado: " + user.getEmail());
        }

        user.setSenha(passwordEncoder.encode(user.getSenha()));
        return usuarioRepository.save(user);
    }

    // ✅ AUTENTICAÇÃO - Login
    public boolean login(String email, String senha) {
        Optional<Usuario> user = usuarioRepository.findByEmail(email);
        if (user.isEmpty()) return false;
        return passwordEncoder.matches(senha, user.get().getSenha());
    }

    // ✅ VALIDAÇÃO - Verificar se email existe
    public boolean emailExiste(String email) {
        return usuarioRepository.existsByEmail(email);
    }

}
