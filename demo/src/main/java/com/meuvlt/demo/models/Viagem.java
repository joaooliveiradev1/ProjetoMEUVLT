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
    private Long idViagem;

    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;

    @ManyToOne
    @JoinColumn(name = "id_condutor", nullable = false)
    private Condutor condutor;

    @ManyToOne
    @JoinColumn(name = "id_vlt", nullable = false)
    private Vlt vlt;

    @ManyToOne
    @JoinColumn(name = "id_linha", nullable = false)
    private Linha linha;
}

