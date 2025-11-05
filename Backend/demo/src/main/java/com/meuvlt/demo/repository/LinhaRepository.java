package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Linha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LinhaRepository extends JpaRepository<Linha, Long> {
    List<Linha> findByNomeContainingIgnoreCase(String nome);

    Optional<Linha> findByNumero(String numero);
}