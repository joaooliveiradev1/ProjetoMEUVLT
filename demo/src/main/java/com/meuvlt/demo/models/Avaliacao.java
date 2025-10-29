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
    private Long idAvaliacao;

    @Enumerated(EnumType.STRING)
    private NotaAvaliacao nota;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "id_usuario_passageiro", nullable = false)
    private Usuario passageiro;

    @ManyToOne
    @JoinColumn(name = "id_viagem")
    private Viagem viagem;
}

