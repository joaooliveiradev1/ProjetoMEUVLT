package com.meuvlt.demo.models;

import com.meuvlt.demo.models.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

@Table(name = "Usuario")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    private String nome;

    private String email;

    private String senha;

    @Enumerated(EnumType.STRING)
    private Role tipo;
}
