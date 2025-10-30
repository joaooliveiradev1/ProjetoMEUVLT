package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Condutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CondutorRepository extends JpaRepository<Condutor, Long> {
    Optional<Condutor> findByMatricula(String matricula);
    Optional<Condutor> findByUsuarioIdUsuario(Long usuarioId);
}
