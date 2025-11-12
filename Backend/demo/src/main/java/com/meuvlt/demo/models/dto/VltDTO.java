package com.meuvlt.demo.models.dto;

import com.meuvlt.demo.models.enums.StatusVlt;
import lombok.Data;

@Data
public class VltDTO {
    private int idVlt;
    private String codigo;
    private String status;
    private String localizacao;


    public int getIdVlt() {
        return idVlt;
    }

    public void setIdVlt(int idVlt) {
        this.idVlt = idVlt;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}