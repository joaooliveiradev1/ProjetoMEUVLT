package com.meuvlt.demo.models;

import com.meuvlt.demo.models.enums.NotaAvaliacao;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Avaliacao")
@Data

public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_avaliacao")
    private Long idAvaliacao;

    @Enumerated(EnumType.STRING)
    private NotaAvaliacao nota;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(
            name = "id_usuario_passageiro",
            referencedColumnName = "id_usuario",
            nullable = false
    )
    private Usuario passageiro;

    @ManyToOne
    @JoinColumn(
            name = "id_viagem",
            referencedColumnName = "id_viagem"
    )
    private Viagem viagem;
}

