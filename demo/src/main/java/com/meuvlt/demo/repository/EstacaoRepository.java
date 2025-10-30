package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Estacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstacaoRepository extends JpaRepository<Estacao, Long> {
    Optional<Estacao> findByNome(String nome);
}
