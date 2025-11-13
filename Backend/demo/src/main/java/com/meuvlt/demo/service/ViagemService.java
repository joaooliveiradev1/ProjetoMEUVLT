package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Viagem;
import com.meuvlt.demo.models.Entity.Condutor;
import com.meuvlt.demo.models.Entity.Vlt;
import com.meuvlt.demo.models.Entity.Linha;
import com.meuvlt.demo.models.dto.ViagemDTO;
import com.meuvlt.demo.repository.ViagemRepository;
import com.meuvlt.demo.repository.CondutorRepository;
import com.meuvlt.demo.repository.VltRepository;
import com.meuvlt.demo.repository.LinhaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ViagemService {

    @Autowired
    private ViagemRepository viagemRepository;

    @Autowired
    private CondutorRepository condutorRepository;

    @Autowired
    private VltRepository vltRepository;

    @Autowired
    private LinhaRepository linhaRepository;

    private ViagemDTO toDTO(Viagem viagem) {
        ViagemDTO dto = new ViagemDTO();
        dto.setIdViagem(viagem.getIdViagem());
        dto.setDataHoraInicio(viagem.getDataHoraInicio());
        dto.setDataHoraFim(viagem.getDataHoraFim());

        if (viagem.getCondutor() != null) {
            dto.setCondutorId(viagem.getCondutor().getIdCondutor());
            dto.setCondutorNome(viagem.getCondutor().getUsuario().getNome());
        }

        if (viagem.getVlt() != null) {
            dto.setVltId(viagem.getVlt().getIdVlt());
            dto.setVltCodigo(viagem.getVlt().getCodigo());
        }

        if (viagem.getLinha() != null) {
            dto.setLinhaId(viagem.getLinha().getIdLinha());
            dto.setLinhaNome(viagem.getLinha().getNome());
        }

        return dto;
    }

    private Viagem toEntity(ViagemDTO dto) {
        Viagem viagem = new Viagem();
        viagem.setDataHoraInicio(dto.getDataHoraInicio());
        viagem.setDataHoraFim(dto.getDataHoraFim());

        Condutor condutor = condutorRepository.findById(dto.getCondutorId())
                .orElseThrow(() -> new RuntimeException("Condutor não encontrado com ID: " + dto.getCondutorId()));
        viagem.setCondutor(condutor);

        Vlt vlt = vltRepository.findById((long) dto.getVltId())
                .orElseThrow(() -> new RuntimeException("VLT não encontrado com ID: " + dto.getVltId()));
        viagem.setVlt(vlt);

        Linha linha = linhaRepository.findById((long) dto.getLinhaId())
                .orElseThrow(() -> new RuntimeException("Linha não encontrada com ID: " + dto.getLinhaId()));
        viagem.setLinha(linha);

        return viagem;
    }

    public ViagemDTO createViagem(ViagemDTO dto) {
        Viagem viagem = toEntity(dto);
        viagemRepository.save(viagem);
        return toDTO(viagem);
    }

    public List<ViagemDTO> getAllViagens() {
        return viagemRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<ViagemDTO> getViagemById(int id) {
        return viagemRepository.findById((long) id).map(this::toDTO);
    }

    public Optional<ViagemDTO> updateViagem(int id, ViagemDTO dto) {
        return viagemRepository.findById((long) id).map(existing -> {
            existing.setDataHoraInicio(dto.getDataHoraInicio());
            existing.setDataHoraFim(dto.getDataHoraFim());

            if (dto.getCondutorId() != 0) {
                Condutor condutor = condutorRepository.findById(dto.getCondutorId())
                        .orElseThrow(() -> new RuntimeException("Condutor não encontrado"));
                existing.setCondutor(condutor);
            }

            if (dto.getVltId() != 0) {
                Vlt vlt = vltRepository.findById((long) dto.getVltId())
                        .orElseThrow(() -> new RuntimeException("VLT não encontrado"));
                existing.setVlt(vlt);
            }

            if (dto.getLinhaId() != 0) {
                Linha linha = linhaRepository.findById((long) dto.getLinhaId())
                        .orElseThrow(() -> new RuntimeException("Linha não encontrada"));
                existing.setLinha(linha);
            }

            viagemRepository.save(existing);
            return toDTO(existing);
        });
    }

    public boolean deleteViagem(int id) {
        if (viagemRepository.existsById((long) id)) {
            viagemRepository.deleteById((long) id);
            return true;
        }
        return false;
    }

    public List<ViagemDTO> getViagensByCondutor(int condutorId) {
        return viagemRepository.findByCondutorId((long) condutorId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ViagemDTO> getViagensByVlt(int vltId) {
        return viagemRepository.findByVltId((long) vltId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ViagemDTO> getViagensByLinha(int linhaId) {
        return viagemRepository.findByLinhaId((long) linhaId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}