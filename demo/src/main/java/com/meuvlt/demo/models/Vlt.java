package com.meuvlt.demo.models;

import com.meuvlt.demo.models.enums.StatusVlt;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "VLT")
@Data
public class Vlt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vlt")
    private Long idVlt;

    @Column(unique = true, nullable = false)
    private String codigo;

    @Enumerated(EnumType.STRING)
    private StatusVlt status;

    private String localizacao;
}


