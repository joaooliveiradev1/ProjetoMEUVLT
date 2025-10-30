package com.meuvlt.demo.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Parada")
@Data
public class Parada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_parada")
    private Long idParada;

    @ManyToOne
    @JoinColumn(name = "id_linha", referencedColumnName = "id_linha", nullable = false)
    private Linha linha;

    @ManyToOne
    @JoinColumn(name = "id_estacao", referencedColumnName = "id_estacao", nullable = false)
    private Estacao estacao;

    private Integer ordem;
}


