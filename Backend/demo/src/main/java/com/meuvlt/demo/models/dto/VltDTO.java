package com.meuvlt.demo.models.dto;

import com.meuvlt.demo.models.enums.StatusVlt;
import lombok.Data;

@Data
public class VltDTO {
    private int idVlt;
    private String codigo;
    private String status;
    private String localizacao;
}