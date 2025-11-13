package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Alerta;
import com.meuvlt.demo.models.Entity.Incidente;
import com.meuvlt.demo.models.Entity.Usuario;
import com.meuvlt.demo.models.dto.AlertaDTO;
import com.meuvlt.demo.repository.AlertaRepository;
import com.meuvlt.demo.repository.IncidenteRepository;
import com.meuvlt.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private IncidenteRepository incidenteRepository;

    public AlertaDTO createAlerta(AlertaDTO dto) {
        Alerta alerta = new Alerta();

        Usuario admin = usuarioRepository.findById(dto.getAdministradorId())
                .orElseThrow(() -> new RuntimeException("Administrador não encontrado"));

        Incidente incidente = incidenteRepository.findById((long) dto.getIncidenteId())
                .orElseThrow(() -> new RuntimeException("Incidente não encontrado"));

        alerta.setTitulo(dto.getTitulo());
        alerta.setMensagem(dto.getMensagem());
        alerta.setDataHoraEnvio(LocalDateTime.now());
        alerta.setAdministrador(admin);
        alerta.setIncidente(incidente);

        Alerta saved = alertaRepository.save(alerta);
        return convertToDTO(saved);
    }

    public List<AlertaDTO> getAll() {
        return alertaRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<AlertaDTO> getById(Long id) {
        return alertaRepository.findById(id).map(this::convertToDTO);
    }

    public List<AlertaDTO> getByAdministradorId(Long adminId) {
        return alertaRepository.findByAdministradorId(adminId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AlertaDTO> getByIncidenteId(Long incidenteId) {
        return alertaRepository.findByIncidenteId(incidenteId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AlertaDTO> getByPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return alertaRepository.findByDataHoraEnvioBetween(inicio, fim)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<AlertaDTO> update(Long id, AlertaDTO dto) {
        return alertaRepository.findById(id).map(alerta -> {
            alerta.setTitulo(dto.getTitulo());
            alerta.setMensagem(dto.getMensagem());
            return convertToDTO(alertaRepository.save(alerta));
        });
    }

    public boolean delete(Long id) {
        if (!alertaRepository.existsById(id)) return false;
        alertaRepository.deleteById(id);
        return true;
    }

    public void criarAlertaAutomatico(Incidente incidente) {
        if (incidente == null) return;

        Alerta alerta = new Alerta();
        alerta.setTitulo("Novo incidente registrado");
        alerta.setMensagem("Um novo incidente foi reportado pelo condutor: " +
                (incidente.getCondutor() != null ? incidente.getCondutor().getUsuario().getNome() : "Desconhecido") +
                ". Descrição: " + incidente.getDescricao());

        alerta.setDataHoraEnvio(LocalDateTime.now());
        alerta.setIncidente(incidente);
        alerta.setAdministrador(null);

        alertaRepository.save(alerta);
    }

    private AlertaDTO convertToDTO(Alerta alerta) {
        AlertaDTO dto = new AlertaDTO();
        dto.setIdAlerta(alerta.getIdAlerta());
        dto.setTitulo(alerta.getTitulo());
        dto.setMensagem(alerta.getMensagem());
        dto.setDataHoraEnvio(alerta.getDataHoraEnvio());

        if (alerta.getAdministrador() != null) {
            dto.setAdministradorId(alerta.getAdministrador().getIdUsuario());
            dto.setAdministradorNome(alerta.getAdministrador().getNome());
        }

        if (alerta.getIncidente() != null) {
            dto.setIncidenteId(alerta.getIncidente().getIdIncidente());
            dto.setIncidenteDescricao(alerta.getIncidente().getDescricao());
        }

        return dto;
    }
}
