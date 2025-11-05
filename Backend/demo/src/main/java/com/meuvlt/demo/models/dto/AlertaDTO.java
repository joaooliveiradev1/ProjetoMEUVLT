package com.meuvlt.demo.models.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AlertaDTO {
    private int idAlerta;
    private String titulo;
    private String mensagem;
    private LocalDateTime dataHoraEnvio;
    private int administradorId;
    private String administradorNome;
    private int incidenteId;
    private String incidenteDescricao;
}