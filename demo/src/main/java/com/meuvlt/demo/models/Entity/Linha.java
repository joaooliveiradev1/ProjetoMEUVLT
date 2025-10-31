package com.meuvlt.demo.models.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Linha")
public class Linha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_linha")
    private int idLinha;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 20)
    private String numero;

    @OneToMany(mappedBy = "linha", cascade = CascadeType.ALL)
    private List<Parada> paradas = new ArrayList<>();

    @OneToMany(mappedBy = "linha")
    private List<Viagem> viagens = new ArrayList<>();

}

