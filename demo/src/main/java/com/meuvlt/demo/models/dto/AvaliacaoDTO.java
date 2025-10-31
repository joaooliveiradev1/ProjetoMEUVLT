package com.meuvlt.demo.models.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AvaliacaoDTO {
    private int idAvaliacao;
    private Integer nota;
    private String comentario;
    private LocalDateTime dataHora;
    private int usuarioPassageiroId;
    private String usuarioPassageiroNome;
    private int viagemId;
    private String viagemInfo;
}