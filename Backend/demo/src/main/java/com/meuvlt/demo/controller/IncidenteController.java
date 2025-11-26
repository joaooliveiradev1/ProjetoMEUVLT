package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.Entity.Incidente;
import com.meuvlt.demo.models.dto.IncidenteDTO;
import com.meuvlt.demo.service.IncidenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/incidente")
@RequiredArgsConstructor
public class IncidenteController {

    @Autowired
    private IncidenteService incidenteService;

    // MUDANÇA: Recebe 'Principal' para saber quem está logado automaticamente
    @PostMapping
    public ResponseEntity<Incidente> criarIncidente(@RequestBody Incidente incidente, Principal principal) {
        // Se o usuário não estiver logado, principal será null (mas o Security já bloqueia antes)
        String emailLogado = principal.getName();
        return ResponseEntity.ok(incidenteService.registrarIncidentePorEmail(incidente, emailLogado));
    }

    // ... (MANTENHA OS OUTROS MÉTODOS IGUAIS: listarIncidentes, listarPorStatus, etc.) ...

    @GetMapping("/status/{status}")
    public ResponseEntity<List<IncidenteDTO>> listarIncidentePorStatus(@PathVariable String status) {
        return ResponseEntity.ok(incidenteService.listarPorStatusDTO(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incidente> buscarIncidentePorId(@PathVariable Long id) {
        return ResponseEntity.ok(incidenteService.buscarPorId(id));
    }

    @GetMapping("/condutor/{id}")
    public ResponseEntity<List<Incidente>> listarIncidentePorCondutor(@PathVariable Long id) {
        return ResponseEntity.ok(incidenteService.listarPorCondutor(id));
    }

    @PutMapping("/{id}/status/{novoStatus}")
    public ResponseEntity<Incidente> atualizarStatusIncidente(@PathVariable Long id, @PathVariable String novoStatus) {
        return ResponseEntity.ok(incidenteService.atualizarStatus(id, novoStatus));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Incidente> atualizarIncidente(@PathVariable Long id, @RequestBody Incidente novosDados) {
        return ResponseEntity.ok(incidenteService.atualizarIncidente(id, novosDados));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarIncidente(@PathVariable Long id) {
        incidenteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}