package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.dto.AlertaDTO;
import com.meuvlt.demo.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/alertas")
@RequiredArgsConstructor
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    @PostMapping
    public ResponseEntity<AlertaDTO> create(@RequestBody AlertaDTO dto) {
        return ResponseEntity.ok(alertaService.createAlerta(dto));
    }

    @GetMapping
    public ResponseEntity<List<AlertaDTO>> getAll() {
        return ResponseEntity.ok(alertaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertaDTO> getById(@PathVariable Long id) {
        return alertaService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/administrador/{id}")
    public ResponseEntity<List<AlertaDTO>> getByAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.getByAdministradorId(id));
    }

    @GetMapping("/incidente/{id}")
    public ResponseEntity<List<AlertaDTO>> getByIncidente(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.getByIncidenteId(id));
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<AlertaDTO>> getByPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(alertaService.getByPeriodo(inicio, fim));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlertaDTO> update(@PathVariable Long id, @RequestBody AlertaDTO dto) {
        return alertaService.update(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = alertaService.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
