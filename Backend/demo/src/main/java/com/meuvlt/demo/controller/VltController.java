package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.dto.VltDTO;
import com.meuvlt.demo.service.VltService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vlt")
public class VltController {

    @Autowired
    private final VltService vltService;

    public VltController(VltService vltService) {
        this.vltService = vltService;
    }


    @PostMapping
    public ResponseEntity<VltDTO> create(@RequestBody VltDTO dto) {
        VltDTO created = vltService.createVlt(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<VltDTO>> getAll() {
        return ResponseEntity.ok(vltService.getAllVlts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VltDTO> getById(@PathVariable Long id) {
        return vltService.getVltById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<VltDTO> getByCodigo(@PathVariable String codigo) {
        return vltService.getVltByCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<VltDTO> update(@PathVariable Long id, @RequestBody VltDTO dto) {
        return vltService.updateVlt(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = vltService.deletaVlt(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
