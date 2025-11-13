package com.meuvlt.demo.models.Entity;

import com.meuvlt.demo.models.dto.UsuarioDTO;
import com.meuvlt.demo.models.dto.UsuarioResponseDTO;
import com.meuvlt.demo.models.enums.TipoUsuario;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Usuario")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private int idUsuario;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoUsuario tipo;

    @OneToMany(mappedBy = "usuarioPassageiro")
    private List<Avaliacao> avaliacoes = new ArrayList<>();

    public UsuarioDTO toDTO() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(this.idUsuario);
        dto.setNome(this.nome);
        dto.setEmail(this.email);
        dto.setTipo(this.tipo);
        return dto;
    }

    public UsuarioResponseDTO toResponseDTO(boolean temPerfilCondutor) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setIdUsuario(this.idUsuario);
        dto.setNome(this.nome);
        dto.setEmail(this.email);
        dto.setTipo(this.tipo);
        dto.setTemPerfilCondutor(temPerfilCondutor);
        return dto;

    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }

    public void setTipo(TipoUsuario tipo) {
        this.tipo = tipo;
    }

}

