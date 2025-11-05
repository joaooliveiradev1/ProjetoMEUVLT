package com.meuvlt.demo.models.dto;

import lombok.Data;

@Data
public class ParadaDTO {
    private int idParada;
    private int ordem;
    private int linhaId;
    private String linhaNome;
    private int estacaoId;
    private String estacaoNome;
    private String estacaoEndereco;
}