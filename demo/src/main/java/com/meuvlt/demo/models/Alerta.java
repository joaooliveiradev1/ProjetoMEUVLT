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
    @Column(name = "id_alerta")
    private Long idAlerta;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @Column(name = "data_hora_envio")
    private LocalDateTime dataHoraEnvio;

    @ManyToOne
    @JoinColumn(
            name = "id_usuario_admin",
            referencedColumnName = "id_usuario"
    )
    private Usuario administrador;

    @ManyToOne
    @JoinColumn(
            name = "id_incidente",
            referencedColumnName = "id_incidente"
    )
    private Incidente incidente;
}


