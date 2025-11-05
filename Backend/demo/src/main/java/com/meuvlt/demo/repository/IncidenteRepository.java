package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Incidente;
import com.meuvlt.demo.models.enums.StatusIncidente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidenteRepository extends JpaRepository<Incidente, Long> {
    List<Incidente> findByStatus(String status);

    @Query("SELECT i FROM Incidente i WHERE i.viagem.id = :viagemId")
    List<Incidente> findByViagemId(@Param("viagemId") Long viagemId);

    @Query("SELECT i FROM Incidente i WHERE i.condutor.id = :condutorId")
    List<Incidente> findByCondutorId(@Param("condutorId") Long condutorId);
}
