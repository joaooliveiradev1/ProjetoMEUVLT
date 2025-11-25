"use client";

import { useEffect, useState } from "react";
import { getLinhas, createIncidente } from "@/services/vltService"; // Importar a função real
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, AlertTriangle, LogOut, Clock, TrainFront } from "lucide-react";

interface Linha { idLinha: number; nome: string; numero: string; }

export default function CondutorOperacaoPage() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [loading, setLoading] = useState(true);
  const [linhaEmOperacao, setLinhaEmOperacao] = useState<Linha | null>(null);

  // Estado do Alerta
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [descAlerta, setDescAlerta] = useState("");
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);

  // ID do condutor fixo para teste (em prod viria do token)
  const CONDUTOR_ID = 1; 

  useEffect(() => {
    async function fetchData() {
      try {
        const linhasData = await getLinhas();
        setLinhas(linhasData);
      } catch (error) {
        console.error("Erro ao carregar linhas", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleIniciarViagem = (linha: Linha) => {
    if (window.confirm(`Iniciar viagem na linha ${linha.nome}?`)) {
      setLinhaEmOperacao(linha);
    }
  };

  const handleEncerrarViagem = () => {
    if(confirm("Encerrar operação atual?")) setLinhaEmOperacao(null);
  };

  // FUNÇÃO PRINCIPAL: ENVIAR INCIDENTE PARA A API
  const handleEnviarIncidente = async () => {
    if (!tipoAlerta || !descAlerta) {
      alert("Preencha o tipo e a descrição.");
      return;
    }
    
    setIsSubmittingAlert(true);
    try {
      // Chama o serviço real
      // O backend vai receber isso, salvar o incidente E criar um Alerta automaticamente
      await createIncidente({
        condutorId: CONDUTOR_ID,
        descricao: `[${tipoAlerta}] ${descAlerta} - Linha: ${linhaEmOperacao?.nome}`,
        // Se tiver viagemId, enviar aqui
      });

      alert("Incidente reportado e alerta gerado com sucesso!");
      setTipoAlerta("");
      setDescAlerta("");
    } catch (error) {
      console.error("Erro API:", error);
      alert("Erro ao reportar incidente. Tente novamente.");
    } finally {
      setIsSubmittingAlert(false);
    }
  };

  if (loading) return <p className="text-center p-12">Carregando dados...</p>;

  // --- TELA DE OPERAÇÃO ATIVA ---
  if (linhaEmOperacao) {
    return (
      <main className="container mx-auto px-6 py-10">
        <Card className="max-w-3xl mx-auto border-l-4 border-l-green-500 shadow-lg">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Painel de Operação Ativo</CardTitle>
                <CardDescription className="mt-1">
                  Você está operando a linha <span className="font-bold text-gray-900">{linhaEmOperacao.nome}</span>
                </CardDescription>
              </div>
              <Badge className="bg-green-600 text-white px-3 py-1 animate-pulse">EM OPERAÇÃO</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BOTÃO DE INCIDENTE (PRINCIPAL) */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="h-24 text-lg w-full shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="h-8 w-8" /> 
                      REPORTAR INCIDENTE
                    </div>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5"/> Reportar Ocorrência
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso gerará um alerta automático para todos os passageiros e para o CCO.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Classificação</Label>
                      <Select value={tipoAlerta} onValueChange={setTipoAlerta}>
                        <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ATRASO">Atraso / Lentidão</SelectItem>
                          <SelectItem value="FALHA_TECNICA">Falha no Trem/Via</SelectItem>
                          <SelectItem value="ACIDENTE">Acidente / Colisão</SelectItem>
                          <SelectItem value="SEGURANCA">Segurança Pública</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Descrição</Label>
                      <Input 
                        placeholder="Detalhe o ocorrido (ex: Ar condicionado falhou no carro 2)" 
                        value={descAlerta}
                        onChange={(e) => setDescAlerta(e.target.value)}
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleEnviarIncidente} disabled={isSubmittingAlert} className="bg-red-600 hover:bg-red-700">
                      {isSubmittingAlert ? "Enviando..." : "Confirmar e Alertar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="secondary" className="h-24 text-lg w-full border border-slate-200" disabled>
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <Clock className="h-8 w-8" /> 
                  Registrar Parada
                </div>
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <Button variant="outline" onClick={handleEncerrarViagem} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                 <LogOut className="h-4 w-4 mr-2" /> Finalizar Viagem e Sair
               </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // --- TELA DE SELEÇÃO DE LINHA ---
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Operação</h1>
      <p className="text-gray-500 mb-8">Selecione a linha para abrir o painel de controle.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {linhas.map((linha) => (
          <Card key={linha.idLinha} className="hover:border-blue-400 transition-colors group cursor-pointer" onClick={() => handleIniciarViagem(linha)}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {linha.nome}
                <TrainFront className="h-5 w-5 text-slate-300 group-hover:text-blue-500" />
              </CardTitle>
              <CardDescription>ID: {linha.numero}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <PlayCircle className="h-4 w-4" /> Iniciar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}