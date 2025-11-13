package com.meuvlt.demo.models.Entity;

import com.meuvlt.demo.models.enums.NotaAvaliacao;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Avaliacao")
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_avaliacao")
    private int idAvaliacao;

    private Integer nota;
    private String comentario;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "id_usuario_passageiro", nullable = false)
    private Usuario usuarioPassageiro;

    @ManyToOne
    @JoinColumn(name = "id_viagem")
    private Viagem viagem;

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

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Usuario getUsuarioPassageiro() {
        return usuarioPassageiro;
    }

    public void setUsuarioPassageiro(Usuario usuarioPassageiro) {
        this.usuarioPassageiro = usuarioPassageiro;
    }

    public Viagem getViagem() {
        return viagem;
    }

    public void setViagem(Viagem viagem) {
        this.viagem = viagem;
    }
}
