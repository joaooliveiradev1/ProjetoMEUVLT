"use client";

import { useEffect, useState } from "react";
import { getLinhas, getEstacoes, getAlertas, Alerta } from "@/services/vltService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, RefreshCw, MapPin } from "lucide-react";

// Interfaces locais
interface Linha { idLinha: number; nome: string; numero: string; }
interface Estacao { idEstacao: number; nome: string; endereco: string; linha: Linha; }

export default function PassageiroLinhasPage() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const carregarDados = async () => {
    try {
      const [linhasData, estacoesData, alertasData] = await Promise.all([
        getLinhas(),
        getEstacoes(),
        getAlertas(),
      ]);
      setLinhas(linhasData);
      setEstacoes(estacoesData);
      
      // Ordenar alertas: mais recentes primeiro
      const alertasRecentes = alertasData.sort((a: Alerta, b: Alerta) => 
        new Date(b.dataHoraEnvio).getTime() - new Date(a.dataHoraEnvio).getTime()
      );
      
      setAlertas(alertasRecentes);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
    
    // ATUALIZAÇÃO AUTOMÁTICA (POLLING) A CADA 30 SEGUNDOS
    const intervalId = setInterval(() => {
      carregarDados();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Linhas e Avisos</h1>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> Atualizado às {lastUpdate.toLocaleTimeString()}
        </span>
      </div>

      {/* MURAL DE ALERTAS EM TEMPO REAL */}
      {alertas.length > 0 && (
        <section className="mb-8 animate-in slide-in-from-top-2 duration-700">
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Alertas Ativos ({alertas.length})
          </h2>
          
          <div className="space-y-3">
            {alertas.map((alerta) => (
              <Card key={alerta.idAlerta} className="border-l-4 border-l-red-500 shadow-md bg-white">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-50 p-2 rounded-full shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800 text-sm md:text-base">{alerta.titulo}</h4>
                        {alerta.incidenteDescricao && (
                          <Badge variant="outline" className="text-[10px] h-5 border-red-200 text-red-600 bg-red-50">INCIDENTE</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{alerta.mensagem}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(alerta.dataHoraEnvio).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* LISTA DE LINHAS */}
      {loading && alertas.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Carregando informações...</p>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-3">
          {linhas.map((linha) => {
            const estacoesDaLinha = estacoes.filter(e => e.linha?.idLinha === linha.idLinha);
            
            return (
              <AccordionItem value={`linha-${linha.idLinha}`} key={linha.idLinha} className="border rounded-xl bg-white px-2 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4 px-2">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-gray-800 text-lg">{linha.nome}</span>
                    <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                      VLT • {linha.numero}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 px-2">
                  <div className="pl-4 border-l-2 border-slate-200 ml-2 space-y-4 mt-2">
                    {estacoesDaLinha.length > 0 ? estacoesDaLinha.map((estacao) => (
                      <div key={estacao.idEstacao} className="relative">
                        <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-400 shadow-sm"></div>
                        <p className="text-sm font-medium text-gray-700">{estacao.nome}</p>
                        {estacao.endereco && <p className="text-xs text-gray-400 truncate max-w-xs">{estacao.endereco}</p>}
                      </div>
                    )) : <p className="text-sm text-gray-400 italic">Sem estações cadastradas.</p>}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </main>
  );
}