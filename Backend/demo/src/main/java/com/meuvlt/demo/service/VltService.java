package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Vlt;
import com.meuvlt.demo.models.dto.VltDTO;
import com.meuvlt.demo.repository.VltRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VltService {

    @Autowired
    private VltRepository vltRepository;

    private VltDTO toDTO(Vlt vlt) {
        VltDTO dto = new VltDTO();
        dto.setIdVlt(vlt.getIdVlt());
        dto.setCodigo(vlt.getCodigo());
        dto.setStatus(vlt.getStatus());
        dto.setLocalizacao(vlt.getLocalizacao());
        return dto;
    }

    private Vlt toEntity(VltDTO dto) {
        Vlt vlt = new Vlt();
        vlt.setCodigo(dto.getCodigo());
        vlt.setStatus(dto.getStatus());
        vlt.setLocalizacao(dto.getLocalizacao());
        return vlt;
    }

    public VltDTO createVlt(VltDTO dto) {
        Vlt vlt = toEntity(dto);
        vltRepository.save(vlt);
        return toDTO(vlt);
    }

    public List<VltDTO> getAllVlts() {
        return vltRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<VltDTO> getVltById(Long id) {
        return vltRepository.findById(id).map(this::toDTO);
    }

    public Optional<VltDTO> getVltByCodigo(String codigo) {
        return vltRepository.findByCodigo(codigo).map(this::toDTO);
    }

    public Optional<VltDTO> updateVlt(Long id, VltDTO dto) {
        return vltRepository.findById(id).map(existing -> {
            existing.setCodigo(dto.getCodigo());
            existing.setStatus(dto.getStatus());
            existing.setLocalizacao(dto.getLocalizacao());
            vltRepository.save(existing);
            return toDTO(existing);
        });
    }

    public boolean deletaVlt(Long id) {
        if (vltRepository.existsById(id)) {
            vltRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
