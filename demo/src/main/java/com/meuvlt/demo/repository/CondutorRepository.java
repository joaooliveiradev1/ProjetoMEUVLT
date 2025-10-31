package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Condutor;
import com.meuvlt.demo.models.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CondutorRepository extends JpaRepository<Condutor, Long> {
    Optional<Condutor> findByMatricula(String matricula);

    @Query("SELECT c FROM Condutor c WHERE c.usuario.id = :usuarioId")
    Optional<Condutor> findByUsuarioId(@Param("usuarioId") int usuarioId);

}
