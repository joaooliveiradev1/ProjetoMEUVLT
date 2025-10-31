package com.meuvlt.demo.models.Entity;

import com.meuvlt.demo.models.enums.NotaAvaliacao;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Avaliacao")
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_avaliacao")
    private int idAvaliacao;

    private Integer nota;
    private String comentario;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "id_usuario_passageiro", nullable = false)
    private Usuario usuarioPassageiro;

    @ManyToOne
    @JoinColumn(name = "id_viagem")
    private Viagem viagem;
}
