package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Linha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LinhaRepository extends JpaRepository<Linha, Long> {
    Optional<Linha> findByNumero(String numero);
}
