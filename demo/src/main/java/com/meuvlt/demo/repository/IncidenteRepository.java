package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Incidente;
import com.meuvlt.demo.models.enums.StatusIncidente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidenteRepository extends JpaRepository<Incidente, Long> {
    List<Incidente> findByStatus(StatusIncidente status);
    List<Incidente> findByViagemIdViagem(Long viagemId);
}
