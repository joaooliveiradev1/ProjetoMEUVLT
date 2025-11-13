package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Condutor;
import com.meuvlt.demo.models.Entity.Usuario;
import com.meuvlt.demo.models.enums.TipoUsuario;
import com.meuvlt.demo.models.dto.CondutorDTO;
import com.meuvlt.demo.models.enums.TipoUsuario;
import com.meuvlt.demo.repository.CondutorRepository;
import com.meuvlt.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CondutorService {

   @Autowired
   private CondutorRepository condutorRepository;
   @Autowired
   private UsuarioRepository usuarioRepository;

    private CondutorDTO toDTO(Condutor condutor) {
        CondutorDTO dto = new CondutorDTO();
        dto.setIdCondutor(condutor.getIdCondutor());
        dto.setMatricula(condutor.getMatricula());

        if (condutor.getUsuario() != null) {
            dto.setUsuarioId(condutor.getUsuario().getIdUsuario());
            dto.setUsuarioNome(condutor.getUsuario().getNome());
            dto.setUsuarioEmail(condutor.getUsuario().getEmail());
        }
        return dto;
    }

    private Condutor toEntity(CondutorDTO dto) {
        Condutor condutor = new Condutor();
        condutor.setMatricula(dto.getMatricula());

        if (dto.getUsuarioId() != 0) {
            Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + dto.getUsuarioId()));
            condutor.setUsuario(usuario);
        }

        return condutor;
    }

    @PreAuthorize("hasAuthority('Administrador')")
    public CondutorDTO createCondutor(CondutorDTO dto) {
        Condutor condutor = toEntity(dto);

        Usuario usuario = condutor.getUsuario();
        if (usuario != null && usuario.getTipo() != TipoUsuario.Condutor) {
            usuario.setTipo(TipoUsuario.Condutor);
            usuarioRepository.save(usuario);
        }

        condutorRepository.save(condutor);
        return toDTO(condutor);
    }

    public List<CondutorDTO> getAllCondutores() {
        return condutorRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<CondutorDTO> getCondutorById(int id) {
        return condutorRepository.findById(id).map(this::toDTO);
    }

    public Optional<CondutorDTO> getCondutorByMatricula(String matricula) {
        return condutorRepository.findByMatricula(matricula).map(this::toDTO);
    }

    @PreAuthorize("hasAuthority('Administrador')")
    public Optional<CondutorDTO> updateCondutor(int id, CondutorDTO dto) {
        return condutorRepository.findById(id).map(existing -> {
            if (dto.getMatricula() != null && !dto.getMatricula().isEmpty()) {
                existing.setMatricula(dto.getMatricula());
            }

            if (dto.getUsuarioId() != 0) {
                Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + dto.getUsuarioId()));

                if (dto.getUsuarioNome() != null && !dto.getUsuarioNome().isEmpty()) {
                    usuario.setNome(dto.getUsuarioNome());
                }
                if (dto.getUsuarioEmail() != null && !dto.getUsuarioEmail().isEmpty()) {
                    usuario.setEmail(dto.getUsuarioEmail());
                }

                if (usuario.getTipo() != TipoUsuario.Condutor) {
                    usuario.setTipo(TipoUsuario.Condutor);
                }

                usuarioRepository.save(usuario);
                existing.setUsuario(usuario);
            }
            condutorRepository.save(existing);
            return toDTO(existing);
        });
    }

    @PreAuthorize("hasAuthority('Administrador')")
    public boolean deleteCondutor(int id) {
        return condutorRepository.findById(id).map(condutor -> {
            int usuarioId = condutor.getUsuario().getIdUsuario();

            condutorRepository.delete(condutor);

            usuarioRepository.deleteById(usuarioId);
            return true;
        }).orElse(false);
    }
}
