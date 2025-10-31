package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Vlt;
import com.meuvlt.demo.models.enums.StatusVlt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VltRepository extends JpaRepository<Vlt, Long> {
    Optional<Vlt> findByCodigo(String codigo);
    List<Vlt> findByStatus(String status);
}
