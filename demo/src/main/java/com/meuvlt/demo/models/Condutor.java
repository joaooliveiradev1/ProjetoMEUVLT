package com.meuvlt.demo.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Condutor")
@Data
public class Condutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCondutor;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(unique = true, nullable = false)
    private String matricula;
}

