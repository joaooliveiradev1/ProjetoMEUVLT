package com.meuvlt.demo.models.dto;

import com.meuvlt.demo.models.enums.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioDTO {
    private int idUsuario;
    private String nome;
    private String email;
    private TipoUsuario tipo;

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }

    public void setTipo(TipoUsuario tipo) {
        this.tipo = tipo;
    }
}