package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    @Query("SELECT a FROM Avaliacao a WHERE a.usuarioPassageiro.id = :usuarioId")
    List<Avaliacao> findByUsuarioPassageiroId(@Param("usuarioId") int usuarioId);

    @Query("SELECT a FROM Avaliacao a WHERE a.viagem.id = :viagemId")
    List<Avaliacao> findByViagemId(@Param("viagemId") int viagemId);


}
