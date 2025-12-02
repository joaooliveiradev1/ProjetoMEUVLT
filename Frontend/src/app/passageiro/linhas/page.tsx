"use client";

import { useEffect, useState } from "react";
import { getLinhas, getEstacoes, getAlertas, getViagens } from "@/services/vltService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, MapPin, Clock, ArrowRight, Info } from "lucide-react";

// Interfaces atualizadas para bater com o Backend e Service
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
interface Alerta {
  idAlerta: number;
  titulo: string;
  mensagem: string;
  dataHoraEnvio: string;
}
interface Viagem {
  idViagem: number;
  dataHoraInicio: string;
  dataHoraFim?: string;
  origem?: string; 
  destino?: string; 
  status: string;
  idLinha: number; 
  linhaNome?: string; // CORREÇÃO: Adicionado '?' para ser opcional
}

export default function PassageiroLinhasPage() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const [linhasData, estacoesData, alertasData, viagensData] = await Promise.all([
        getLinhas(),
        getEstacoes(),
        getAlertas(),
        getViagens(),
      ]);
      
      setLinhas(linhasData);
      setEstacoes(estacoesData);
      setAlertas(alertasData);
      setViagens(viagensData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const formatarHora = (dataString?: string) => {
    if (!dataString) return "--:--";
    return new Date(dataString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  if (loading) {
    return <p className="text-center p-12 text-gray-500">Carregando informações...</p>;
  }

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meu VLT</h1>
        <p className="text-gray-500">Informações em tempo real sobre sua viagem.</p>
      </div>

      <Tabs defaultValue="linhas" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="linhas" className="text-base">
           Linhas e Horários
          </TabsTrigger>
          <TabsTrigger value="alertas" className="text-base relative">
             Alertas e Avisos
            {alertas.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 rounded-full text-[10px]">
                {alertas.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linhas" className="space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {linhas.map((linha) => {
              const estacoesDaLinha = estacoes.filter((e) => e.linha?.idLinha === linha.idLinha);
              
              const viagensDaLinha = viagens
                .filter(v => v.idLinha === linha.idLinha && v.status !== 'CONCLUIDA')
                .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());

              const temAtraso = viagensDaLinha.some(v => v.status === 'ATRASADO');
              const statusGeral = temAtraso ? "ATRASOS RELATADOS" : "OPERANDO NORMALMENTE";
              const corGeral = temAtraso ? "bg-red-600" : "bg-green-600";

              return (
                <AccordionItem value={`linha-${linha.idLinha}`} key={linha.idLinha} className="border rounded-xl bg-white shadow-sm overflow-hidden">
                  <AccordionTrigger className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 pr-4">
                      <div className="flex flex-col items-start text-left">
                        <span className="text-lg font-bold text-gray-800">{linha.nome}</span>
                        <span className="text-sm text-gray-500">Código: {linha.numero}</span>
                      </div>
                      <Badge className={`${corGeral} text-white hover:${corGeral} border-0`}>
                        {statusGeral}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="p-0">
                    <div className="p-6 bg-slate-50 space-y-8">
                      
                      {/* PRÓXIMAS VIAGENS */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" /> 
                          Próximas Partidas
                        </h4>
                        
                        {viagensDaLinha.length > 0 ? (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {viagensDaLinha.map((viagem) => (
                              <div key={viagem.idViagem} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col gap-2 relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                  viagem.status === 'ATRASADO' ? 'bg-red-500' : 
                                  viagem.status === 'EM_VIAGEM' ? 'bg-green-500' : 'bg-blue-500'
                                }`} />
                                
                                <div className="pl-2 flex flex-col gap-1">
                                  <div className="flex justify-between items-center">
                                    {/* HORÁRIO DE INÍCIO GRANDE */}
                                    <span className="text-2xl font-bold text-gray-800">
                                      {formatarHora(viagem.dataHoraInicio)}
                                    </span>

                                    <Badge variant="outline" className={`
                                      ${viagem.status === 'EM_VIAGEM' ? 'text-green-700 border-green-200 bg-green-50' : 
                                        viagem.status === 'ATRASADO' ? 'text-red-700 border-red-200 bg-red-50' : 
                                        'text-gray-600 border-gray-200 bg-gray-50'}
                                    `}>
                                      {viagem.status === 'EM_VIAGEM' ? 'Em Trânsito' : 
                                       viagem.status === 'ATRASADO' ? 'Atrasado' : 'Agendada'}
                                    </Badge>
                                  </div>

                                  {/* HORÁRIO DE CHEGADA (SOLICITADO) */}
                                  {viagem.dataHoraFim && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                      <ArrowRight className="h-3 w-3" />
                                      Prev. Chegada: {formatarHora(viagem.dataHoraFim)}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600 pl-2 mt-2 border-t pt-2">
                                  <span className="truncate font-medium">{viagem.linhaNome}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-white rounded-lg border border-dashed text-gray-500 text-sm">
                            <p>Nenhuma viagem programada para breve nesta linha.</p>
                          </div>
                        )}
                      </div>

                      {/* LISTA DE ESTAÇÕES */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" /> 
                          Estações
                        </h4>
                        {estacoesDaLinha.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {estacoesDaLinha.map((estacao, index) => (
                              <div key={estacao.idEstacao} className="flex items-center">
                                <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                                  {estacao.nome}
                                </span>
                                {index < estacoesDaLinha.length - 1 && (
                                  <div className="w-4 h-[1px] bg-gray-300 mx-1"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic text-sm">Nenhuma estação cadastrada.</p>
                        )}
                      </div>

                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TabsContent>

        <TabsContent value="alertas">
          {alertas.length === 0 ? (
            <Card className="text-center py-12 border-dashed">
              <CardContent>
                <div className="mb-4 flex justify-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Info className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Tudo operando normalmente</h3>
                <p className="text-gray-500">Não há alertas ou incidentes reportados no momento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {alertas.map((alerta) => (
                <Card key={alerta.idAlerta} className="border-l-4 border-l-red-500 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      {alerta.titulo}
                    </CardTitle>
                    <CardDescription>
                      Reportado em: {new Date(alerta.dataHoraEnvio).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800 text-lg">{alerta.mensagem}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}