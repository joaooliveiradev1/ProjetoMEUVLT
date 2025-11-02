package com.meuvlt.demo.controller;

import com.meuvlt.demo.models.dto.UsuarioCreateDTO;
import com.meuvlt.demo.models.dto.UsuarioDTO;
import com.meuvlt.demo.models.dto.UsuarioResponseDTO;
import com.meuvlt.demo.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizarUsuario(
            @PathVariable int id,
            @RequestBody UsuarioCreateDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable int id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}