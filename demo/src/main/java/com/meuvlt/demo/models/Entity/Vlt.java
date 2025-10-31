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

    // Construtores, getters e setters
}


