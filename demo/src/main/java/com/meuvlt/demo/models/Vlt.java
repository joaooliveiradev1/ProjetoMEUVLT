package com.meuvlt.demo.models;

import com.meuvlt.demo.models.enums.StatusVlt;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Vlt")
@Data
public class Vlt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVlt;

    @Column(unique = true, nullable = false)
    private String codigo;

    @Enumerated(EnumType.STRING)
    private StatusVlt status;

    private String localizacao;
}

