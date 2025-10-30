package com.meuvlt.demo.models;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Viagem")
@Data
public class Viagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_viagem")
    private Long idViagem;

    @Column(name = "data_hora_inicio")
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_fim")
    private LocalDateTime dataHoraFim;

    @ManyToOne
    @JoinColumn(
            name = "id_condutor",
            referencedColumnName = "id_condutor",
            nullable = false
    )
    private Condutor condutor;

    @ManyToOne
    @JoinColumn(
            name = "id_vlt",
            referencedColumnName = "id_vlt",
            nullable = false
    )
    private Vlt vlt;

    @ManyToOne
    @JoinColumn(
            name = "id_linha",
            referencedColumnName = "id_linha",
            nullable = false
    )
    private Linha linha;
}

