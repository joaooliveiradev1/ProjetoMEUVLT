package com.meuvlt.demo.models.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Alerta")
public class Alerta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alerta")
    private int idAlerta;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String mensagem;

    @Column(name = "data_hora_envio", nullable = false)
    private LocalDateTime dataHoraEnvio;

    @ManyToOne
    @JoinColumn(name = "id_usuario_admin")
    private Usuario administrador;

    @ManyToOne
    @JoinColumn(name = "id_incidente")
    private Incidente incidente;

}


