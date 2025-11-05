package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Estacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstacaoRepository extends JpaRepository<Estacao, Long> {
    List<Estacao> findByNomeContainingIgnoreCase(String nome);

    @Query("SELECT e FROM Estacao e WHERE e.linha = :linha")
    List<Estacao> findByLinha(@Param("linha") int linha);

    List<Estacao> findByLinhaIdLinha(Long idLinha);

    @Query("SELECT e FROM Estacao e WHERE e.linha.idLinha = :idLinha")
    List<Estacao> buscarEstacoesPorIdLinha(@Param("idLinha") Long idLinha);

}
