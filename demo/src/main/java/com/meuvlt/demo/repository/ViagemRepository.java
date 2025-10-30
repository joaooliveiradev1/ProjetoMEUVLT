package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Viagem;
import com.meuvlt.demo.models.Condutor;
import com.meuvlt.demo.models.Vlt;
import com.meuvlt.demo.models.Vlt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Long> {
    List<Viagem> findByCondutor(Condutor condutor);
    List<Viagem> findByVlt(Vlt vlt);
    List<Viagem> findByDataHoraInicioBetween(LocalDateTime inicio, LocalDateTime fim);
}
