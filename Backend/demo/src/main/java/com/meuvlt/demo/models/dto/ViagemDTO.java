package com.meuvlt.demo.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ViagemDTO {
    private int idViagem;
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;

    @JsonProperty("idCondutor")
    private int condutorId;

    private String condutorNome;

    @JsonProperty("idVlt")
    private int vltId;

    private String vltCodigo;

    @JsonProperty("idLinha")
    private int linhaId;

    private String linhaNome;

    public int getIdViagem() {
        return idViagem;
    }

    public void setIdViagem(int idViagem) {
        this.idViagem = idViagem;
    }

    public LocalDateTime getDataHoraInicio() {
        return dataHoraInicio;
    }

    public void setDataHoraInicio(LocalDateTime dataHoraInicio) {
        this.dataHoraInicio = dataHoraInicio;
    }

    public LocalDateTime getDataHoraFim() {
        return dataHoraFim;
    }

    public void setDataHoraFim(LocalDateTime dataHoraFim) {
        this.dataHoraFim = dataHoraFim;
    }

    public int getCondutorId() {
        return condutorId;
    }

    public void setCondutorId(int condutorId) {
        this.condutorId = condutorId;
    }

    public String getCondutorNome() {
        return condutorNome;
    }

    public void setCondutorNome(String condutorNome) {
        this.condutorNome = condutorNome;
    }

    public int getVltId() {
        return vltId;
    }

    public void setVltId(int vltId) {
        this.vltId = vltId;
    }

    public String getVltCodigo() {
        return vltCodigo;
    }

    public void setVltCodigo(String vltCodigo) {
        this.vltCodigo = vltCodigo;
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

    // Adicione no DTO também
    private String status;

    // Getters e Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
