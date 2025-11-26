package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Alerta;
import com.meuvlt.demo.models.Entity.Incidente;
import com.meuvlt.demo.models.Entity.Viagem;
import com.meuvlt.demo.models.Entity.Condutor;
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

    public Incidente criarIncidente(Incidente incidente) {
        incidente.setDataHora(LocalDateTime.now());
        incidente.setStatus(StatusIncidente.PENDENTE.name());
        Incidente salvo = incidenteRepository.save(incidente);

        alertaService.criarAlertaAutomatico(salvo);

        return salvo;
    }

    public List<Incidente> listarTodos() {
        return incidenteRepository.findAll();
    }

    public Incidente buscarPorId(Long id) {
        return incidenteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Incidente não encontrado com id " + id));
    }

    public List<Incidente> listarPorCondutor(Long condutorId) {
        return incidenteRepository.findByCondutorId(condutorId);
    }

    public List<Incidente> listarPorStatus(String status) {
        return incidenteRepository.findByStatus(status);
    }

    public Incidente atualizarStatus(Long id, String novoStatus) {
        Incidente incidente = buscarPorId(id);
        incidente.setStatus(novoStatus);
        return incidenteRepository.save(incidente);
    }

    public Incidente atualizarIncidente(Long id, Incidente novosDados) {
        Incidente existente = buscarPorId(id);

        if (novosDados.getDescricao() != null) {
            existente.setDescricao(novosDados.getDescricao());
        }

        if (novosDados.getDataHora() != null) {
            existente.setDataHora(novosDados.getDataHora());
        }

        if (novosDados.getStatus() != null) {
            existente.setStatus(novosDados.getStatus());
        }

        if (novosDados.getViagem() != null) {
            Viagem viagem = viagemRepository.findById((long) novosDados.getViagem().getIdViagem())
                    .orElseThrow(() -> new EntityNotFoundException("Viagem não encontrada"));
            existente.setViagem(viagem);
        }

        if (novosDados.getCondutor() != null) {
            Condutor condutor = condutorRepository.findById(novosDados.getCondutor().getIdCondutor())
                    .orElseThrow(() -> new EntityNotFoundException("Condutor não encontrado"));
            existente.setCondutor(condutor);
        }

        return incidenteRepository.save(existente);
    }

    @Transactional
    public void deletar(Long id) {
        List<Alerta> alertas = alertaRepository.findByIncidenteId(id);

        if (!alertas.isEmpty()) {
            alertaRepository.deleteAll(alertas);
        }
        incidenteRepository.deleteById(id);
    }
}
