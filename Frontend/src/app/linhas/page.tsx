"use client";

import { useEffect, useState } from "react";
import { getLinhas, getEstacoes } from "@/services/vltService";
import { FunnelPlus } from "lucide-react";

interface Linha {
  id: number;
  nome: string;
  descricao?: string;
}

interface Estacao {
  id: number;
  nome: string;
  localizacao?: string;
  linhaId: number;
}

export default function LinhasPage() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [linhasData, estacoesData] = await Promise.all([
          getLinhas(),
          getEstacoes(),
        ]);
        setLinhas(linhasData);
        setEstacoes(estacoesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 text-lg">Carregando linhas e estações...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
        Linhas e Estações do VLT
      </h1>

      {linhas.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma linha cadastrada.</p>
      ) : (
        <div className="space-y-10">
          {linhas.map((linha) => {
            const estacoesDaLinha = estacoes.filter(
              (e) => e.linhaId === linha.id
            );

            return (
              <div
                key={linha.id}
                className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition p-6"
              >
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  {linha.nome}
                </h2>
                <p className="text-gray-700 mb-4">
                  {linha.descricao || "Sem descrição disponível."}
                </p>

                {estacoesDaLinha.length > 0 ? (
                  <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {estacoesDaLinha.map((estacao) => (
                      <li
                        key={estacao.id}
                        className="bg-gray-50 border rounded-xl p-4 text-center shadow-sm hover:bg-blue-50 transition"
                      >
                        <p className="font-medium text-gray-800">{estacao.nome}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {estacao.localizacao || "Localização não informada"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    Nenhuma estação cadastrada nesta linha.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
  
}
