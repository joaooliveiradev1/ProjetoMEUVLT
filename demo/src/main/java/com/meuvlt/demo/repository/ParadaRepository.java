package com.meuvlt.demo.repository;

import com.meuvlt.demo.models.Parada;
import com.meuvlt.demo.models.Linha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParadaRepository extends JpaRepository<Parada, Long> {
    List<Parada> findByLinhaOrderByOrdemAsc(Linha linha);
}
