package com.meuvlt.demo.models.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Estacao")
public class Estacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estacao")
    private int idEstacao;

    @Column(nullable = false, length = 100)
    private String nome;

    private String endereco;

    @OneToMany(mappedBy = "estacao", cascade = CascadeType.ALL)
    private List<Parada> paradas = new ArrayList<>();

}
