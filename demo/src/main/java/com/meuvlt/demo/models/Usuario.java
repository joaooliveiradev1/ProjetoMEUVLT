package com.meuvlt.demo.models;

import com.meuvlt.demo.models.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Usuario")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    private String senha;

    @Enumerated(EnumType.STRING)
    private Role tipo;

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Role getTipo() {
        return tipo;
    }

    public void setTipo(Role tipo) {
        this.tipo = tipo;
    }
}

