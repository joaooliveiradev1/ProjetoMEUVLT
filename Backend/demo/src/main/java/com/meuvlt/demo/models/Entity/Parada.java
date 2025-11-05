package com.meuvlt.demo.models.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Parada")
public class Parada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_parada")
    private int idParada;

    @ManyToOne
    @JoinColumn(name = "id_linha", nullable = false)
    private Linha linha;

    @ManyToOne
    @JoinColumn(name = "id_estacao", nullable = false)
    private Estacao estacao;

    private Integer ordem;

}


