package com.meuvlt.demo.models.Entity;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Viagem")
public class Viagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_viagem")
    private int idViagem;

    @Column(name = "data_hora_inicio", nullable = false)
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_fim")
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

    @OneToMany(mappedBy = "viagem")
    private List<Incidente> incidentes = new ArrayList<>();

    @OneToMany(mappedBy = "viagem")
    private List<Avaliacao> avaliacoes = new ArrayList<>();
}

