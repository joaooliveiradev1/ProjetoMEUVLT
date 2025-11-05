package com.meuvlt.demo.service;

import com.meuvlt.demo.models.Entity.Linha;
import com.meuvlt.demo.repository.LinhaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LinhaService {

    @Autowired
    private LinhaRepository linhaRepository;

    // Create
    public Linha criarLinha(Linha linha) {
        return linhaRepository.save(linha);
    }

    public List<Linha> listarLinhas() {
        return linhaRepository.findAll();
    }

    public Linha updateLinha(int id, Linha linhaDetails) {
        Optional<Linha> optionalLinha = linhaRepository.findById((long) id);

        if (optionalLinha.isPresent()) {
            Linha linha = optionalLinha.get();
            linha.setNome(linhaDetails.getNome());
            linha.setNumero(linhaDetails.getNumero());
            return linhaRepository.save(linha);
        }
        return null;
    }

    public boolean deleteLinha(int id) {
        Optional<Linha> optionalLinha = linhaRepository.findById((long) id);

        if (optionalLinha.isPresent()) {
            linhaRepository.delete(optionalLinha.get());
            return true;
        }
        return false;
    }
    public Optional<Linha> getLinhaById(int idLinha) {
        return linhaRepository.findById((long) idLinha);
    }

}