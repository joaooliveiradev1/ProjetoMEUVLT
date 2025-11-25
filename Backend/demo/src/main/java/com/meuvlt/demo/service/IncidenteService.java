package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Alerta;
import com.meuvlt.demo.models.Entity.Incidente;
import com.meuvlt.demo.models.Entity.Viagem;
import com.meuvlt.demo.models.Entity.Condutor;
import com.meuvlt.demo.models.dto.IncidenteDTO; // Importante: Use o DTO
import com.meuvlt.demo.models.enums.StatusIncidente;
import com.meuvlt.demo.repository.AlertaRepository;
import com.meuvlt.demo.repository.IncidenteRepository;
import com.meuvlt.demo.repository.ViagemRepository;
import com.meuvlt.demo.repository.CondutorRepository;
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
    private ViagemRepository viagemRepository;
    @Autowired
    private CondutorRepository condutorRepository;
    @Autowired
    private AlertaService alertaService;
    @Autowired
    private AlertaRepository alertaRepository;

    // Conversor Manual para evitar loops de JSON
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
        if (incidente.getViagem() != null) {
            dto.setViagemId((long) incidente.getViagem().getIdViagem());
        }
        return dto;
    }

    // 1. Criação: Salva como PENDENTE e NÃO cria alerta ainda
    public Incidente criarIncidente(Incidente incidente) {
        incidente.setDataHora(LocalDateTime.now());
        incidente.setStatus(StatusIncidente.PENDENTE.name());

        // Garantir que o objeto Condutor esteja carregado se vier apenas o ID
        if (incidente.getCondutor() != null && incidente.getCondutor().getIdCondutor() != 0) {
            Condutor c = condutorRepository.findById(incidente.getCondutor().getIdCondutor())
                    .orElseThrow(() -> new RuntimeException("Condutor não encontrado"));
            incidente.setCondutor(c);
        }

        return incidenteRepository.save(incidente);
    }

    // 2. Busca: Retorna DTOs para o Frontend não quebrar
    public List<IncidenteDTO> listarPorStatusDTO(String status) {
        List<Incidente> lista = incidenteRepository.findByStatus(status);
        return lista.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // 3. Aprovação: Se virar PUBLICADO, cria o alerta
    public Incidente atualizarStatus(Long id, String novoStatus) {
        Incidente incidente = incidenteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Incidente não encontrado"));

        incidente.setStatus(novoStatus);
        Incidente salvo = incidenteRepository.save(incidente);

        // Lógica de Aprovação
        if ("PUBLICADO".equalsIgnoreCase(novoStatus)) {
            alertaService.criarAlertaAutomatico(salvo);
        }

        return salvo;
    }

    // Métodos auxiliares mantidos
    public List<Incidente> listarTodos() { return incidenteRepository.findAll(); }

    public Incidente buscarPorId(Long id) {
        return incidenteRepository.findById(id).orElseThrow();
    }

    public List<Incidente> listarPorCondutor(Long condutorId) {
        return incidenteRepository.findByCondutorId(condutorId);
    }

    public Incidente atualizarIncidente(Long id, Incidente novosDados) {
        Incidente existente = buscarPorId(id);
        if (novosDados.getDescricao() != null) existente.setDescricao(novosDados.getDescricao());
        return incidenteRepository.save(existente);
    }

    @Transactional
    public void deletar(Long id) {
        List<Alerta> alertas = alertaRepository.findByIncidenteId(id);
        if (!alertas.isEmpty()) alertaRepository.deleteAll(alertas);
        incidenteRepository.deleteById(id);
    }
}