package com.meuvlt.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "Linha")
@Data
public class Linha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLinha;

    private String nome;

    private String numero;

    @OneToMany(mappedBy = "linha")
    private List<Parada> paradas;
}

