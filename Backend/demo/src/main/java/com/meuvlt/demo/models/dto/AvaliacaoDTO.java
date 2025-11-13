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

    public int getIdAvaliacao() {
        return idAvaliacao;
    }

    public void setIdAvaliacao(int idAvaliacao) {
        this.idAvaliacao = idAvaliacao;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public int getUsuarioPassageiroId() {
        return usuarioPassageiroId;
    }

    public void setUsuarioPassageiroId(int usuarioPassageiroId) {
        this.usuarioPassageiroId = usuarioPassageiroId;
    }

    public String getUsuarioPassageiroNome() {
        return usuarioPassageiroNome;
    }

    public void setUsuarioPassageiroNome(String usuarioPassageiroNome) {
        this.usuarioPassageiroNome = usuarioPassageiroNome;
    }

    public String getViagemInfo() {
        return viagemInfo;
    }

    public void setViagemInfo(String viagemInfo) {
        this.viagemInfo = viagemInfo;
    }

    public int getViagemId() {
        return viagemId;
    }

    public void setViagemId(int viagemId) {
        this.viagemId = viagemId;
    }
}