package com.meuvlt.demo.models.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IncidenteDTO {
    private Long idIncidente;
    private String descricao;
    private LocalDateTime dataHora;
    private String status;
    private Long condutorId;
    private String condutorNome;
    private Long viagemId;

    public Long getIdIncidente() {
        return idIncidente;
    }

    public void setIdIncidente(Long idIncidente) {
        this.idIncidente = idIncidente;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCondutorId() {
        return condutorId;
    }

    public void setCondutorId(Long condutorId) {
        this.condutorId = condutorId;
    }

    public String getCondutorNome() {
        return condutorNome;
    }

    public void setCondutorNome(String condutorNome) {
        this.condutorNome = condutorNome;
    }

    public Long getViagemId() {
        return viagemId;
    }

    public void setViagemId(Long viagemId) {
        this.viagemId = viagemId;
    }
}
