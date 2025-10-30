package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByAdministradorIdUsuario(Long adminId);
    List<Alerta> findByIncidenteIdIncidente(Long incidenteId);
}
