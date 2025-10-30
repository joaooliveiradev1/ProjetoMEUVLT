package com.meuvlt.demo.models;

import com.meuvlt.demo.models.Condutor;
import com.meuvlt.demo.models.Viagem;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Incidente")
@Data
public class Incidente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incidente")
    private Long idIncidente;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    private String status;

    @ManyToOne
    @JoinColumn(
            name = "id_usuario_condutor",
            referencedColumnName = "id_condutor"
    )
    private Condutor condutor;

    @ManyToOne
    @JoinColumn(
            name = "id_viagem",
            referencedColumnName = "id_viagem"
    )
    private Viagem viagem;
}

