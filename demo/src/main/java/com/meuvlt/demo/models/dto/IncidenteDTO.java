package com.meuvlt.demo.models.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class IncidenteDTO {
    private int idIncidente;
    private String descricao;
    private LocalDateTime dataHora;
    private String status;
    private int condutorId;
    private String condutorNome;
    private int viagemId;
    private String viagemInfo;
}