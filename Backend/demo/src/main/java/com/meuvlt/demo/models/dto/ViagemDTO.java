package com.meuvlt.demo.models.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ViagemDTO {
    private int idViagem;
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
    private int condutorId;
    private String condutorNome;
    private int vltId;
    private String vltCodigo;
    private int linhaId;
    private String linhaNome;
}
