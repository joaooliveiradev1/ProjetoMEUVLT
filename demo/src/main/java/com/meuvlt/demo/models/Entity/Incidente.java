package com.meuvlt.demo.models.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Incidente")
public class Incidente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incidente")
    private int idIncidente;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    private String status;

    @ManyToOne
    @JoinColumn(name = "id_usuario_condutor")
    private Condutor condutor;

    @ManyToOne
    @JoinColumn(name = "id_viagem")
    private Viagem viagem;

    @OneToMany(mappedBy = "incidente")
    private List<Alerta> alertas = new ArrayList<>();

    // Construtores, getters e setters
}

