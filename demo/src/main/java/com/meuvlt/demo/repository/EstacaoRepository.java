package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Estacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstacaoRepository extends JpaRepository<Estacao, Long> {
    List<Estacao> findByNomeContainingIgnoreCase(String nome);
}
