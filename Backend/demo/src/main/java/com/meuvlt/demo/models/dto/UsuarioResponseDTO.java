package com.meuvlt.demo.models.dto;

import com.meuvlt.demo.models.enums.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private int idUsuario;
    private String nome;
    private String email;
    private TipoUsuario tipo;
    private boolean temPerfilCondutor;

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

    public boolean isTemPerfilCondutor() {
        return temPerfilCondutor;
    }

    public void setTemPerfilCondutor(boolean temPerfilCondutor) {
        this.temPerfilCondutor = temPerfilCondutor;
    }
}