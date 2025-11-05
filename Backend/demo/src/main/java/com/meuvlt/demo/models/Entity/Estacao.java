package com.meuvlt.demo.models.Entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Estacao")
public class Estacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estacao")
    private Integer idEstacao;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 200)
    private String endereco;

    // RELAÇÃO CORRIGIDA
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_linha")
    private Linha linha;

    @OneToMany(mappedBy = "estacao", cascade = CascadeType.ALL)
    private List<Parada> paradas = new ArrayList<>();

    public Estacao() {}

    public Estacao(String nome, String endereco, Linha linha) {
        this.nome = nome;
        this.endereco = endereco;
        this.linha = linha;
    }

    // GETTERS E SETTERS MANUAIS (IMPORTANTE!)
    public Long getIdEstacao() {
        return Long.valueOf(idEstacao);
    }

    public void setIdEstacao(Integer idEstacao) {
        this.idEstacao = idEstacao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Linha getLinha() {
        return linha;
    }

    public void setLinha(Linha linha) {
        System.out.println("=== SETTER LINHA CHAMADO ===");
        System.out.println("Linha recebida: " + (linha != null ? linha.getIdLinha() : "null"));
        this.linha = linha;
        System.out.println("Linha atribuída: " + (this.linha != null ? this.linha.getIdLinha() : "null"));
    }

    public List<Parada> getParadas() {
        return paradas;
    }

    public void setParadas(List<Parada> paradas) {
        this.paradas = paradas;
    }
}