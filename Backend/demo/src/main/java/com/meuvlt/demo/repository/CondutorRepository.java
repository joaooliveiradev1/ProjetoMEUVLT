package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Condutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CondutorRepository extends JpaRepository<Condutor, Integer> {

    // CORREÇÃO AQUI: O nome no @Param deve ser igual ao nome na Query (:usuarioId)
    @Query("SELECT c FROM Condutor c WHERE c.usuario.idUsuario = :usuarioId")
    Optional<Condutor> findByUsuarioId(@Param("usuarioId") int usuarioId);

    @Query("SELECT c FROM Condutor c WHERE c.matricula = :matricula")
    Optional<Condutor> findByMatricula(@Param("matricula") String matricula);
}