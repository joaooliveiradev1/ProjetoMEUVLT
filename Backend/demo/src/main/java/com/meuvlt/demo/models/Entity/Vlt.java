package com.meuvlt.demo.models.Entity;

import com.meuvlt.demo.models.enums.StatusVlt;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "VLT")
public class Vlt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vlt")
    private int idVlt;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    private String status;
    private String localizacao;

    @OneToMany(mappedBy = "vlt")
    private List<Viagem> viagens = new ArrayList<>();

    public int getIdVlt() {
        return idVlt;
    }

    public void setIdVlt(int idVlt) {
        this.idVlt = idVlt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public List<Viagem> getViagens() {
        return viagens;
    }

    public void setViagens(List<Viagem> viagens) {
        this.viagens = viagens;
    }
}


