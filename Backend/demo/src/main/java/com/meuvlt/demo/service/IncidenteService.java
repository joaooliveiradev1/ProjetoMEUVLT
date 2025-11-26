package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Alerta;
import com.meuvlt.demo.models.Entity.Incidente;
import com.meuvlt.demo.models.Entity.Condutor;
import com.meuvlt.demo.models.Entity.Usuario;
import com.meuvlt.demo.models.dto.IncidenteDTO;
import com.meuvlt.demo.models.enums.StatusIncidente;
import com.meuvlt.demo.repository.AlertaRepository;
import com.meuvlt.demo.repository.IncidenteRepository;
import com.meuvlt.demo.repository.ViagemRepository;
import com.meuvlt.demo.repository.CondutorRepository;
import com.meuvlt.demo.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidenteService {

    @Autowired
    private IncidenteRepository incidenteRepository;
    @Autowired
    private CondutorRepository condutorRepository;
    @Autowired
    private UsuarioRepository usuarioRepository; // Adicione isto
    @Autowired
    private AlertaService alertaService;
    @Autowired
    private AlertaRepository alertaRepository;

    // --- MÉTODO NOVO: ACHA O CONDUTOR PELO EMAIL ---
    public Incidente registrarIncidentePorEmail(Incidente incidente, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário logado não encontrado no banco."));

        Condutor condutor = condutorRepository.findByUsuarioId(usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("ERRO DE DADOS: O usuário '" + usuario.getNome() +
                        "' é do tipo Condutor mas não tem cadastro na tabela 'Condutor'. Contate o admin."));

        incidente.setCondutor(condutor);
        incidente.setDataHora(LocalDateTime.now());
        incidente.setStatus(StatusIncidente.PENDENTE.name());

        return incidenteRepository.save(incidente);
    }
    // -----------------------------------------------

    private IncidenteDTO toDTO(Incidente incidente) {
        IncidenteDTO dto = new IncidenteDTO();
        dto.setIdIncidente((long) incidente.getIdIncidente());
        dto.setDescricao(incidente.getDescricao());
        dto.setDataHora(incidente.getDataHora());
        dto.setStatus(incidente.getStatus());
        if (incidente.getCondutor() != null) {
            dto.setCondutorId((long) incidente.getCondutor().getIdCondutor());
            dto.setCondutorNome(incidente.getCondutor().getUsuario().getNome());
        }
        return dto;
    }

    // (Mantenha os outros métodos: criarIncidente antigo, listarPorStatusDTO, atualizarStatus, etc.)
    public Incidente criarIncidente(Incidente incidente) {
        // Método legado, mantido para compatibilidade se necessário
        incidente.setDataHora(LocalDateTime.now());
        incidente.setStatus(StatusIncidente.PENDENTE.name());
        return incidenteRepository.save(incidente);
    }

    public List<IncidenteDTO> listarPorStatusDTO(String status) {
        return incidenteRepository.findByStatus(status).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Incidente atualizarStatus(Long id, String novoStatus) {
        Incidente incidente = incidenteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Incidente não encontrado"));
        incidente.setStatus(novoStatus);
        Incidente salvo = incidenteRepository.save(incidente);
        if ("PUBLICADO".equalsIgnoreCase(novoStatus)) {
            alertaService.criarAlertaAutomatico(salvo);
        }
        return salvo;
    }

    public List<Incidente> listarTodos() { return incidenteRepository.findAll(); }
    public Incidente buscarPorId(Long id) { return incidenteRepository.findById(id).orElseThrow(); }
    public List<Incidente> listarPorCondutor(Long condutorId) { return incidenteRepository.findByCondutorId(condutorId); }
    public Incidente atualizarIncidente(Long id, Incidente novosDados) { return incidenteRepository.save(novosDados); }
    @Transactional
    public void deletar(Long id) {
        List<Alerta> alertas = alertaRepository.findByIncidenteId(id);
        if (!alertas.isEmpty()) alertaRepository.deleteAll(alertas);
        incidenteRepository.deleteById(id);
    }
}