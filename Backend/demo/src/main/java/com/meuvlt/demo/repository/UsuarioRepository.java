package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Usuario;
import com.meuvlt.demo.models.enums.TipoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Usuario> findByTipo(TipoUsuario tipo);




}

