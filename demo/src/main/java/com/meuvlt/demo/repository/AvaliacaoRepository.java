package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Avaliacao;
import com.meuvlt.demo.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByPassageiroIdUsuario(Long passageiroId);
}
