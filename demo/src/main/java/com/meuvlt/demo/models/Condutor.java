package com.meuvlt.demo.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Condutor")
@Data
public class Condutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_condutor")
    private Long idCondutor;

    @OneToOne
    @JoinColumn(
            name = "id_usuario",
            referencedColumnName = "id_usuario",
            nullable = false
    )
    private Usuario usuario;

    @Column(nullable = false, unique = true)
    private String matricula;
}

