package com.meuvlt.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Alerta")
@Data
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAlerta;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    private LocalDateTime dataHoraEnvio;

    @ManyToOne
    @JoinColumn(name = "id_usuario_admin")
    private Usuario administrador;

    @ManyToOne
    @JoinColumn(name = "id_incidente")
    private Incidente incidente;
}

