package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.Entity.Estacao;
import com.meuvlt.demo.service.EstacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/estacoes")
public class EstacaoController {

    @Autowired
    private EstacaoService estacaoService;

    @PostMapping("/linha/{idLinha}")
    public ResponseEntity<?> createEstacaoWithLinha(
            @RequestBody Estacao estacao,
            @PathVariable int idLinha) {
        try {
            Estacao novaEstacao = estacaoService.criarEstacaoComLinha(estacao, idLinha);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaEstacao);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao criar estação");
        }
    }

    // ENDPOINT PARA BUSCAR ESTAÇÕES POR LINHA (também está faltando)
    @GetMapping("/linha/{idLinha}")
    public ResponseEntity<List<Estacao>> getEstacoesByLinha(@PathVariable int idLinha) {
        List<Estacao> estacoes = estacaoService.findByLinhaId((long) idLinha);
        return ResponseEntity.ok(estacoes);
    }

    @PostMapping
    public ResponseEntity<Estacao> createEstacao(@RequestBody Estacao estacao) {
        Estacao novaEstacao = estacaoService.save(estacao);
        return ResponseEntity.ok(novaEstacao);
    }

    @GetMapping
    public ResponseEntity<List<Estacao>> getAllEstacoes() {
        List<Estacao> estacoes = estacaoService.findAll();
        return ResponseEntity.ok(estacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estacao> getEstacaoById(@PathVariable int id) {
        Optional<Estacao> estacao = estacaoService.findById((long) id);
        return estacao.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estacao> updateEstacao(@PathVariable int id, @RequestBody Estacao estacaoDetails) {
        Estacao estacaoAtualizada = estacaoService.updateEstacao((long) id, estacaoDetails);
        return estacaoAtualizada != null ?
                ResponseEntity.ok(estacaoAtualizada) :
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstacao(@PathVariable int id) {
        boolean deleted = estacaoService.deleteById(id);
        return deleted ? ResponseEntity.noContent().build() :
                ResponseEntity.notFound().build();
    }
}