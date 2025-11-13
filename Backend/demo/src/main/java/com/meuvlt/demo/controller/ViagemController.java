package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.dto.ViagemDTO;
import com.meuvlt.demo.service.ViagemService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/viagem")
@RequiredArgsConstructor
public class ViagemController {

    @Autowired
    private ViagemService viagemService;

    @PostMapping
    public ResponseEntity<ViagemDTO> create(@RequestBody ViagemDTO dto) {
        ViagemDTO created = viagemService.createViagem(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<ViagemDTO>> getAll() {
        return ResponseEntity.ok(viagemService.getAllViagens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViagemDTO> getById(@PathVariable int id) {
        return viagemService.getViagemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViagemDTO> update(@PathVariable int id, @RequestBody ViagemDTO dto) {
        return viagemService.updateViagem(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        boolean deleted = viagemService.deleteViagem(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/condutor/{condutorId}")
    public ResponseEntity<List<ViagemDTO>> getByCondutor(@PathVariable int condutorId) {
        return ResponseEntity.ok(viagemService.getViagensByCondutor(condutorId));
    }

    @GetMapping("/vlt/{vltId}")
    public ResponseEntity<List<ViagemDTO>> getByVlt(@PathVariable int vltId) {
        return ResponseEntity.ok(viagemService.getViagensByVlt(vltId));
    }

    @GetMapping("/linha/{linhaId}")
    public ResponseEntity<List<ViagemDTO>> getByLinha(@PathVariable int linhaId) {
        return ResponseEntity.ok(viagemService.getViagensByLinha(linhaId));
    }
}