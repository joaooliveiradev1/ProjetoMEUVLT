package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Parada;
import com.meuvlt.demo.models.Entity.Linha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParadaRepository extends JpaRepository<Parada, Long> {
    @Query("SELECT p FROM Parada p WHERE p.linha.id = :linhaId")
    List<Parada> findByLinhaId(@Param("linhaId") Long linhaId);

    @Query("SELECT p FROM Parada p WHERE p.estacao.id = :estacaoId")
    List<Parada> findByEstacaoId(@Param("estacaoId") Long estacaoId);

    @Query("SELECT p FROM Parada p WHERE p.linha.id = :linhaId ORDER BY p.ordem")
    List<Parada> findByLinhaIdOrderByOrdem(@Param("linhaId") Long linhaId);
}

