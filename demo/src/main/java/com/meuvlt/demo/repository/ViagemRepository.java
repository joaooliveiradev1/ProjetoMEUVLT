package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Entity.Viagem;
import com.meuvlt.demo.models.Entity.Condutor;
import com.meuvlt.demo.models.Entity.Vlt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Long> {
    @Query("SELECT v FROM Viagem v WHERE v.condutor.id = :condutorId")
    List<Viagem> findByCondutorId(@Param("condutorId") Long condutorId);

    @Query("SELECT v FROM Viagem v WHERE v.vlt.id = :vltId")
    List<Viagem> findByVltId(@Param("vltId") Long vltId);

    @Query("SELECT v FROM Viagem v WHERE v.linha.id = :linhaId")
    List<Viagem> findByLinhaId(@Param("linhaId") Long linhaId);

    List<Viagem> findByDataHoraInicioBetween(LocalDateTime inicio, LocalDateTime fim);
}
