package com.meuvlt.demo.models.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Viagem")
public class Viagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_viagem")
    private int idViagem;

    @Column(name = "data_hora_inicio", nullable = false)
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_fim")
    private LocalDateTime dataHoraFim;

    @ManyToOne
    @JoinColumn(name = "id_condutor", nullable = false)
    private Condutor condutor;

    @ManyToOne
    @JoinColumn(name = "id_vlt", nullable = false)
    private Vlt vlt;

    @ManyToOne
    @JoinColumn(name = "id_linha", nullable = false)
    private Linha linha;

    @OneToMany(mappedBy = "viagem")
    @JsonIgnore
    private List<Incidente> incidentes = new ArrayList<>();

    @OneToMany(mappedBy = "viagem")
    private List<Avaliacao> avaliacoes = new ArrayList<>();

    // Adicione este campo na classe Viagem
    @Column(nullable = false)
    private String status; // Ex: "AGENDADA", "EM_VIAGEM", "CONCLUIDA"

    // Adicione os Getters e Setters
    public String getStatus() { return status; }
    
    public void setStatus(String status) { this.status = status; }

    public int getIdViagem() {
        return idViagem;
    }

    public void setIdViagem(int idViagem) {
        this.idViagem = idViagem;
    }

    public LocalDateTime getDataHoraInicio() {
        return dataHoraInicio;
    }

    public void setDataHoraInicio(LocalDateTime dataHoraInicio) {
        this.dataHoraInicio = dataHoraInicio;
    }

    public LocalDateTime getDataHoraFim() {
        return dataHoraFim;
    }

    public void setDataHoraFim(LocalDateTime dataHoraFim) {
        this.dataHoraFim = dataHoraFim;
    }

    public Condutor getCondutor() {
        return condutor;
    }

    public void setCondutor(Condutor condutor) {
        this.condutor = condutor;
    }

    public Vlt getVlt() {
        return vlt;
    }

    public void setVlt(Vlt vlt) {
        this.vlt = vlt;
    }

    public Linha getLinha() {
        return linha;
    }

    public void setLinha(Linha linha) {
        this.linha = linha;
    }

    public List<Incidente> getIncidentes() {
        return incidentes;
    }

    public void setIncidentes(List<Incidente> incidentes) {
        this.incidentes = incidentes;
    }

    public List<Avaliacao> getAvaliacoes() {
        return avaliacoes;
    }

    public void setAvaliacoes(List<Avaliacao> avaliacoes) {
        this.avaliacoes = avaliacoes;
    }
}

