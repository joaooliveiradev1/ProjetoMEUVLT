"use client";

import { useEffect, useState } from "react";
// Importa o getAlertas real
import { getLinhas, getEstacoes, getAlertas } from "@/services/vltService"; 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle, MapPin } from "lucide-react";

// Interfaces de Linha e Estacao (sem mudança)
interface Linha {
  idLinha: number;
  nome: string;
  numero: string;
}
interface Estacao {
  idEstacao: number;
  nome: string;
  endereco: string;
  linha: Linha;
}

// --- NOVA INTERFACE DE ALERTA ---
// Baseada no AlertaDTO.java do backend
//
interface Alerta {
  idAlerta: number;
  titulo: string;
  mensagem: string;
  dataHoraEnvio: string; // (LocalDateTime é recebido como string)
  incidenteDescricao: string;
  administradorNome?: string; // Pode ser nulo
}

// Mock de status (seria outra chamada de API, mantido por enquanto)
const mockStatus = {
  1: { status: "ATRASADO", cor: "bg-yellow-500" },
  2: { status: "OPERANDO COM RESTRIÇÃO", cor: "bg-blue-500" },
  3: { status: "OPERANDO NORMALMENTE", cor: "bg-green-600" },
};

export default function PassageiroLinhasPage() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]); // Estado para Alertas reais
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      // Chama todas as APIs reais em paralelo
      const [linhasData, estacoesData, alertasData] = await Promise.all([
        getLinhas(),
        getEstacoes(),
        getAlertas(), // Busca os alertas reais
      ]);
      setLinhas(linhasData);
      setEstacoes(estacoesData);
      setAlertas(alertasData); // Salva os alertas no estado
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // Você pode adicionar um polling para getAlertas() aqui
    // const interval = setInterval(fetchData, 30000); // Atualiza a cada 30s
    // return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="text-center p-12">Carregando linhas e alertas...</p>;
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Linhas e Alertas
      </h1>

      {/* --- MURAL DE ALERTAS (NOVA SEÇÃO) --- */}
      {/* Exibido aqui pois o DTO do Alerta não permite filtrar por linha */}
      {alertas.length > 0 && (
        <Card className="mb-10 border-l-4 border-l-red-500 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Mural de Alertas Ativos ({alertas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertas.map((alerta) => (
              <div key={alerta.idAlerta} className="pb-3 border-b border-red-100 last:border-b-0">
                {/* Usando os campos do AlertaDTO 
                  
                */}
                <h4 className="font-semibold text-gray-800">{alerta.titulo}</h4>
                <p className="text-sm text-gray-600">{alerta.mensagem}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {/* Formata a data (simplificado) */}
                  {new Date(alerta.dataHoraEnvio).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* --- LISTAGEM DE LINHAS (SEM ALTERAÇÃO) --- */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {linhas.map((linha) => {
          const estacoesDaLinha = estacoes.filter(
            (e) => e.linha?.idLinha === linha.idLinha
          );

          // @ts-ignore
          const status = mockStatus[linha.idLinha] || mockStatus[3];

          return (
            <AccordionItem value={`linha-${linha.idLinha}`} key={linha.idLinha} className="border rounded-lg bg-white shadow-sm">
              <AccordionTrigger className="p-6 text-lg font-medium hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <span>{linha.nome}</span>
                  <Badge className={`${status.cor} text-white hover:${status.cor}`}>
                    {status.status}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                
                {/* Seção de Alertas removida daqui */}

                {/* Estações da Linha */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" /> Estações
                  </h4>
                  {estacoesDaLinha.length > 0 ? (
                    <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {estacoesDaLinha.map((estacao) => (
                        <li
                          key={estacao.idEstacao} 
                          className="bg-gray-50 border rounded-lg p-3"
                        >
                          <p className="font-medium text-gray-700">
                            {estacao.nome}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      Nenhuma estação cadastrada.
                    </p>
                  )}
                </div>

              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </main>
  );
}