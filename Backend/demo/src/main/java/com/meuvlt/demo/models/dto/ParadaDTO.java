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

    public int getIdParada() {
        return idParada;
    }

    public void setIdParada(int idParada) {
        this.idParada = idParada;
    }

    public int getOrdem() {
        return ordem;
    }

    public void setOrdem(int ordem) {
        this.ordem = ordem;
    }

    public int getLinhaId() {
        return linhaId;
    }

    public void setLinhaId(int linhaId) {
        this.linhaId = linhaId;
    }

    public String getLinhaNome() {
        return linhaNome;
    }

    public void setLinhaNome(String linhaNome) {
        this.linhaNome = linhaNome;
    }

    public int getEstacaoId() {
        return estacaoId;
    }

    public void setEstacaoId(int estacaoId) {
        this.estacaoId = estacaoId;
    }

    public String getEstacaoNome() {
        return estacaoNome;
    }

    public void setEstacaoNome(String estacaoNome) {
        this.estacaoNome = estacaoNome;
    }

    public String getEstacaoEndereco() {
        return estacaoEndereco;
    }

    public void setEstacaoEndereco(String estacaoEndereco) {
        this.estacaoEndereco = estacaoEndereco;
    }
}