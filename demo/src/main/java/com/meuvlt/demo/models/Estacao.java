package com.meuvlt.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "Estacao")
@Data
public class Estacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estacao")
    private Long idEstacao;

    private String nome;

    private String endereco;

    @OneToMany(mappedBy = "estacao")
    private List<Parada> paradas;
}


