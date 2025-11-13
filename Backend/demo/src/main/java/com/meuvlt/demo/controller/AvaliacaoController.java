package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.dto.AvaliacaoDTO;
import com.meuvlt.demo.service.AvaliacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacao")
@RequiredArgsConstructor
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @PostMapping
    public ResponseEntity<AvaliacaoDTO> create(@RequestBody AvaliacaoDTO dto) {
        AvaliacaoDTO created = avaliacaoService.createAvaliacao(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoDTO>> getAll() {
        return ResponseEntity.ok(avaliacaoService.getAllAvaliacoes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoDTO> getById(@PathVariable int id) {
        return avaliacaoService.getAvaliacaoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AvaliacaoDTO> update(@PathVariable int id, @RequestBody AvaliacaoDTO dto) {
        return avaliacaoService.updateAvaliacao(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        boolean deleted = avaliacaoService.deleteAvaliacao(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<AvaliacaoDTO>> getByUsuarioPassageiro(@PathVariable int usuarioId) {
        return ResponseEntity.ok(avaliacaoService.getAvaliacoesByUsuarioPassageiro(usuarioId));
    }

    @GetMapping("/viagem/{viagemId}")
    public ResponseEntity<List<AvaliacaoDTO>> getByViagem(@PathVariable int viagemId) {
        return ResponseEntity.ok(avaliacaoService.getAvaliacoesByViagem(viagemId));
    }

    @GetMapping("/media/viagem/{viagemId}")
    public ResponseEntity<Double> getMediaByViagem(@PathVariable int viagemId) {
        return ResponseEntity.ok(avaliacaoService.getMediaAvaliacoesByViagem(viagemId));
    }

    @GetMapping("/media/condutor/{condutorId}")
    public ResponseEntity<Double> getMediaByCondutor(@PathVariable int condutorId) {
        return ResponseEntity.ok(avaliacaoService.getMediaAvaliacoesByCondutor(condutorId));
    }
}