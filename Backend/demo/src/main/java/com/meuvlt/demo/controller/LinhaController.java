package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.Entity.Linha;
import com.meuvlt.demo.service.LinhaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/linhas")
public class LinhaController {

    @Autowired
    private LinhaService linhaService;

    @PostMapping
    public ResponseEntity<Linha> criarLinha(@RequestBody Linha linha) {
        Linha novaLinha = linhaService.criarLinha(linha);
        return ResponseEntity.ok(novaLinha);
    }

    @GetMapping
    public ResponseEntity<List<Linha>> listarLinhas() {
        List<Linha> linhas = linhaService.listarLinhas();
        return ResponseEntity.ok(linhas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Linha> getLinhaById(@PathVariable int id) {
        Optional<Linha> linha = linhaService.getLinhaById(id);
        return linha.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Linha> updateLinha(@PathVariable int id, @RequestBody Linha linhaDetails) {
        Linha linhaAtualizada = linhaService.updateLinha(id, linhaDetails);
        return linhaAtualizada != null ?
                ResponseEntity.ok(linhaAtualizada) :
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLinha(@PathVariable int id) {
        boolean deleted = linhaService.deleteLinha(id);
        return deleted ? ResponseEntity.noContent().build() :
                ResponseEntity.notFound().build();
    }
}