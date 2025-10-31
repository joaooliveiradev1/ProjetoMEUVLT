package com.meuvlt.demo.models.dto;

import lombok.Data;

@Data
public class CondutorDTO {
    private int idCondutor;
    private String matricula;
    private int usuarioId;
    private String usuarioNome;
    private String usuarioEmail;

}