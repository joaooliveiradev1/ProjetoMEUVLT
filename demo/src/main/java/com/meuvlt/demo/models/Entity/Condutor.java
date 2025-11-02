package com.meuvlt.demo.models.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Condutor")
public class Condutor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_condutor")
    private int idCondutor;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, unique = true)
    private String matricula;

    @OneToMany(mappedBy = "condutor")
    private List<Viagem> viagens = new ArrayList<>();

    @OneToMany(mappedBy = "condutor")
    private List<Incidente> incidentes = new ArrayList<>();

    public void setUsuario(Usuario novoUsuario) {
    }
}

