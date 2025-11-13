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

    public int getIdAlerta() {
        return idAlerta;
    }

    public void setIdAlerta(int idAlerta) {
        this.idAlerta = idAlerta;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public LocalDateTime getDataHoraEnvio() {
        return dataHoraEnvio;
    }

    public void setDataHoraEnvio(LocalDateTime dataHoraEnvio) {
        this.dataHoraEnvio = dataHoraEnvio;
    }

    public int getAdministradorId() {
        return administradorId;
    }

    public void setAdministradorId(int administradorId) {
        this.administradorId = administradorId;
    }

    public String getAdministradorNome() {
        return administradorNome;
    }

    public void setAdministradorNome(String administradorNome) {
        this.administradorNome = administradorNome;
    }

    public int getIncidenteId() {
        return incidenteId;
    }

    public void setIncidenteId(int incidenteId) {
        this.incidenteId = incidenteId;
    }

    public String getIncidenteDescricao() {
        return incidenteDescricao;
    }

    public void setIncidenteDescricao(String incidenteDescricao) {
        this.incidenteDescricao = incidenteDescricao;
    }
}