"use client";

import { useEffect, useState } from "react";
import { getLinhas, createIncidente } from "@/services/vltService";
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
import { PlayCircle, AlertTriangle, LogOut } from "lucide-react";

interface Linha {
  idLinha: number;
  nome: string;
  numero: string;
}

export default function CondutorOperacaoPage() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [loading, setLoading] = useState(true);
  const [linhaEmOperacao, setLinhaEmOperacao] = useState<Linha | null>(null);

  const [tipoAlerta, setTipoAlerta] = useState("");
  const [descAlerta, setDescAlerta] = useState("");
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const linhasData = await getLinhas();
        setLinhas(linhasData);
      } catch (error) {
        console.error("Erro ao carregar linhas:", error);
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
    setLinhaEmOperacao(null);
  };

  const handleEnviarAlerta = async () => {
    if (!tipoAlerta || !descAlerta) {
      alert("Preencha o tipo e a descrição.");
      return;
    }
    
    setIsSubmittingAlert(true);
    try {
      // AGORA É SIMPLES: Só manda o texto. O Backend descobre quem é você pelo Token.
      await createIncidente({
        descricao: `[${tipoAlerta}] ${descAlerta} - Linha: ${linhaEmOperacao?.nome}`,
        // Não enviamos mais 'condutor: {id: ...}'. O Java resolve isso.
      });

      alert("Incidente enviado com sucesso! Aguardando aprovação do CCO.");
      setTipoAlerta("");
      setDescAlerta("");
    } catch (error: any) {
      console.error("Erro:", error);
      // Mostra a mensagem de erro real do backend (ex: se não tiver cadastro na tabela condutor)
      const msg = error.response?.data || "Erro ao enviar incidente.";
      alert("Falha: " + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
    } finally {
      setIsSubmittingAlert(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando sistema...</div>;

  if (linhaEmOperacao) {
    return (
      <main className="container mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto border-l-4 border-l-green-600 shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Painel de Operação</span>
              <Badge className="bg-green-600 animate-pulse">Em Operação</Badge>
            </CardTitle>
            <CardDescription>Linha: {linhaEmOperacao.nome}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="h-24 text-lg w-full shadow-md">
                  <AlertTriangle className="h-8 w-8 mr-2" /> REPORTAR OCORRÊNCIA
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reportar Incidente</AlertDialogTitle>
                  <AlertDialogDescription>O alerta será enviado para aprovação do Admin.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Tipo</Label>
                    <Select value={tipoAlerta} onValueChange={setTipoAlerta}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FALHA_MECANICA">Falha Mecânica</SelectItem>
                        <SelectItem value="ATRASO">Atraso</SelectItem>
                        <SelectItem value="VIA_BLOQUEADA">Via Bloqueada</SelectItem>
                        <SelectItem value="SEGURANCA">Segurança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Descrição</Label>
                    <Input placeholder="Detalhes..." value={descAlerta} onChange={(e) => setDescAlerta(e.target.value)} />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEnviarAlerta} disabled={isSubmittingAlert} className="bg-red-600">
                    {isSubmittingAlert ? "Enviando..." : "Enviar Reporte"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" onClick={handleEncerrarViagem} className="w-full">
               <LogOut className="h-4 w-4 mr-2" /> Encerrar Viagem
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Iniciar Operação</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {linhas.map((linha) => (
          <Card key={linha.idLinha} className="cursor-pointer hover:border-blue-500" onClick={() => handleIniciarViagem(linha)}>
            <CardHeader>
              <CardTitle>{linha.nome}</CardTitle>
              <CardDescription>Código: {linha.numero}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full"><PlayCircle className="mr-2 h-4 w-4"/> Iniciar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}