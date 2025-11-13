package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.dto.CondutorDTO;
import com.meuvlt.demo.service.CondutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/condutor")
@RequiredArgsConstructor
public class CondutorController {

    @Autowired
    private CondutorService condutorService;

    @PreAuthorize("hasRole('Administrador')")
    @PostMapping
    public ResponseEntity<CondutorDTO> create(@RequestBody CondutorDTO dto) {
        CondutorDTO created = condutorService.createCondutor(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<CondutorDTO>> getAll() {
        return ResponseEntity.ok(condutorService.getAllCondutores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CondutorDTO> getById(@PathVariable int id) {
        return condutorService.getCondutorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/matricula/{matricula}")
    public ResponseEntity<CondutorDTO> getByMatricula(@PathVariable String matricula) {
        return condutorService.getCondutorByMatricula(matricula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('Administrador')")
    @PutMapping("/{id}")
    public ResponseEntity<CondutorDTO> update(@PathVariable int id, @RequestBody CondutorDTO dto) {
        return condutorService.updateCondutor(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('Administrador')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        boolean deleted = condutorService.deleteCondutor(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
