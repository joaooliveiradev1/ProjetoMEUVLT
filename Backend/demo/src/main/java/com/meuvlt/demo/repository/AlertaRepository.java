package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    @Query("SELECT a FROM Alerta a WHERE a.administrador.id = :administradorId")
    List<Alerta> findByAdministradorId(@Param("administradorId") Long administradorId);

    @Query("SELECT a FROM Alerta a WHERE a.incidente.id = :incidenteId")
    List<Alerta> findByIncidenteId(@Param("incidenteId") Long incidenteId);

    List<Alerta> findByDataHoraEnvioBetween(java.time.LocalDateTime inicio, java.time.LocalDateTime fim);
}
