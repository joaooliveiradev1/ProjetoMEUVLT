package com.meuvlt.demo.models.enums;

public enum NotaAvaliacao {
    RUIM(1),
    REGULAR(2),
    BOM(3),
    OTIMO(4),
    EXCELENTE(5);

    private final int valor;

    NotaAvaliacao(int valor) {
        this.valor = valor;
    }

    public int getValor() {
        return valor;
    }
}
