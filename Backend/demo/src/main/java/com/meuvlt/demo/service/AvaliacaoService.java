package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Avaliacao;
import com.meuvlt.demo.models.Entity.Usuario;
import com.meuvlt.demo.models.Entity.Viagem;
import com.meuvlt.demo.models.dto.AvaliacaoDTO;
import com.meuvlt.demo.repository.AvaliacaoRepository;
import com.meuvlt.demo.repository.UsuarioRepository;
import com.meuvlt.demo.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ViagemRepository viagemRepository;

    private AvaliacaoDTO toDTO(Avaliacao avaliacao) {
        AvaliacaoDTO dto = new AvaliacaoDTO();
        dto.setIdAvaliacao(avaliacao.getIdAvaliacao());
        dto.setNota(avaliacao.getNota());
        dto.setComentario(avaliacao.getComentario());
        dto.setDataHora(avaliacao.getDataHora());

        if (avaliacao.getUsuarioPassageiro() != null) {
            dto.setUsuarioPassageiroId(avaliacao.getUsuarioPassageiro().getIdUsuario());
            dto.setUsuarioPassageiroNome(avaliacao.getUsuarioPassageiro().getNome());
        }

        if (avaliacao.getViagem() != null) {
            dto.setViagemId(avaliacao.getViagem().getIdViagem());
            String viagemInfo = String.format("Viagem %d - %s",
                    avaliacao.getViagem().getIdViagem(),
                    avaliacao.getViagem().getDataHoraInicio().toLocalDate().toString());
            dto.setViagemInfo(viagemInfo);
        }

        return dto;
    }

    private Avaliacao toEntity(AvaliacaoDTO dto) {
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setDataHora(dto.getDataHora() != null ? dto.getDataHora() : LocalDateTime.now());

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioPassageiroId())
                .orElseThrow(() -> new RuntimeException("Usuário passageiro não encontrado com ID: " + dto.getUsuarioPassageiroId()));
        avaliacao.setUsuarioPassageiro(usuario);

        if (dto.getViagemId() != 0) {
            Viagem viagem = viagemRepository.findById((long) dto.getViagemId())
                    .orElseThrow(() -> new RuntimeException("Viagem não encontrada com ID: " + dto.getViagemId()));
            avaliacao.setViagem(viagem);
        }

        return avaliacao;
    }

    public AvaliacaoDTO createAvaliacao(AvaliacaoDTO dto) {
        Avaliacao avaliacao = toEntity(dto);
        avaliacaoRepository.save(avaliacao);
        return toDTO(avaliacao);
    }

    public List<AvaliacaoDTO> getAllAvaliacoes() {
        return avaliacaoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<AvaliacaoDTO> getAvaliacaoById(int id) {
        return avaliacaoRepository.findById((long) id).map(this::toDTO);
    }

    public Optional<AvaliacaoDTO> updateAvaliacao(int id, AvaliacaoDTO dto) {
        return avaliacaoRepository.findById((long) id).map(existing -> {
            if (dto.getNota() != null) {
                existing.setNota(dto.getNota());
            }
            if (dto.getComentario() != null) {
                existing.setComentario(dto.getComentario());
            }
            if (dto.getDataHora() != null) {
                existing.setDataHora(dto.getDataHora());
            }

            if (dto.getUsuarioPassageiroId() != 0) {
                Usuario usuario = usuarioRepository.findById(dto.getUsuarioPassageiroId())
                        .orElseThrow(() -> new RuntimeException("Usuário passageiro não encontrado"));
                existing.setUsuarioPassageiro(usuario);
            }

            if (dto.getViagemId() != 0) {
                Viagem viagem = viagemRepository.findById((long) dto.getViagemId())
                        .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
                existing.setViagem(viagem);
            }

            avaliacaoRepository.save(existing);
            return toDTO(existing);
        });
    }

    public boolean deleteAvaliacao(int id) {
        if (avaliacaoRepository.existsById((long) id)) {
            avaliacaoRepository.deleteById((long) id);
            return true;
        }
        return false;
    }

    public List<AvaliacaoDTO> getAvaliacoesByUsuarioPassageiro(int usuarioId) {
        return avaliacaoRepository.findByUsuarioPassageiroId(usuarioId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AvaliacaoDTO> getAvaliacoesByViagem(int viagemId) {
        return avaliacaoRepository.findByViagemId(viagemId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Double getMediaAvaliacoesByViagem(int viagemId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByViagemId(viagemId);
        if (avaliacoes.isEmpty()) {
            return 0.0;
        }

        double soma = avaliacoes.stream()
                .mapToInt(Avaliacao::getNota)
                .sum();
        return soma / avaliacoes.size();
    }

    public Double getMediaAvaliacoesByCondutor(int condutorId) {
        List<Viagem> viagens = viagemRepository.findByCondutorId((long) condutorId);

        double soma = 0;
        int count = 0;

        for (Viagem viagem : viagens) {
            List<Avaliacao> avaliacoes = avaliacaoRepository.findByViagemId(viagem.getIdViagem());
            for (Avaliacao avaliacao : avaliacoes) {
                soma += avaliacao.getNota();
                count++;
            }
        }
        return count > 0 ? soma / count : 0.0;
    }
}