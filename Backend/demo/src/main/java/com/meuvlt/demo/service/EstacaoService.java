package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Estacao;
import com.meuvlt.demo.models.Entity.Linha;
import com.meuvlt.demo.repository.EstacaoRepository;
import com.meuvlt.demo.repository.LinhaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstacaoService {

    @Autowired
    private EstacaoRepository estacaoRepository;

    @Autowired
    private LinhaRepository linhaRepository;


    public Estacao criarEstacaoComLinha(Estacao estacao, int idLinha) {

        Linha linha = linhaRepository.findById((long) idLinha)
                .orElseThrow(() -> new RuntimeException("Linha não encontrada: " + idLinha));

        Estacao novaEstacao = new Estacao();
        novaEstacao.setNome(estacao.getNome());
        novaEstacao.setEndereco(estacao.getEndereco());

        novaEstacao.setLinha(linha);
        Estacao saved = estacaoRepository.save(novaEstacao);

        Optional<Estacao> verificacao = estacaoRepository.findById(saved.getIdEstacao());
        if (verificacao.isPresent()) {
            Estacao doBanco = verificacao.get();
        }
        return saved;
    }

    public Estacao save(Estacao estacao) {
        return estacaoRepository.save(estacao);
    }

    public List<Estacao> findAll() {
        return estacaoRepository.findAll();
    }

    public Optional<Estacao> findById(Long id) {
        return estacaoRepository.findById(id);
    }

    public boolean deleteById(int id) {
        estacaoRepository.deleteById((long) id);
        return false;
    }

    public List<Estacao> findByLinhaId(Long idLinha) {
        return estacaoRepository.findByLinhaIdLinha(idLinha);
    }


    public List<Estacao> findByLinha(Linha linha) {
        return estacaoRepository.findByLinha(linha.getIdLinha());
    }

    public Estacao updateEstacao(Long id, Estacao estacaoDetails) {
        Optional<Estacao> optionalEstacao = estacaoRepository.findById(id);

        if (optionalEstacao.isPresent()) {
            Estacao estacao = optionalEstacao.get();
            if (estacaoDetails.getNome() != null) {
                estacao.setNome(estacaoDetails.getNome());
            }

            if (estacaoDetails.getEndereco() != null) {
                estacao.setEndereco(estacaoDetails.getEndereco());
            }

            if (estacaoDetails.getLinha() != null) {
                estacao.setLinha(estacaoDetails.getLinha());
            }

            return estacaoRepository.save(estacao);
        }
        return null;
    }
}