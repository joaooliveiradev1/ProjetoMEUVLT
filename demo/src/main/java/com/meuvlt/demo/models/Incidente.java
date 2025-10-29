package com.meuvlt.demo.models;

import com.meuvlt.demo.models.enums.StatusIncidente;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Incidente")
@Data
public class Incidente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idIncidente;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private StatusIncidente status;

    @ManyToOne
    @JoinColumn(name = "id_usuario_condutor")
    private Condutor condutor;

    @ManyToOne
    @JoinColumn(name = "id_viagem")
    private Viagem viagem;
}

