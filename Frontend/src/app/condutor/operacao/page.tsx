"use client";

import { useEffect, useState } from "react";
import { getLinhas } from "@/services/vltService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, AlertTriangle, Send, LogOut, Clock } from "lucide-react";

interface Linha {
  idLinha: number;
  nome: string;
  numero: string;
}


async function enviarAlertaAPI(alertaData: any) {
  console.log("Enviando alerta:", alertaData);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true };
}


export default function CondutorOperacaoPage() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [loading, setLoading] = useState(true);
  const [linhaEmOperacao, setLinhaEmOperacao] = useState<Linha | null>(null);

  
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [descAlerta, setDescAlerta] = useState("");
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleIniciarViagem = (linha: Linha) => {
    if (window.confirm(`Tem certeza que deseja iniciar a viagem na linha ${linha.nome}?`)) {
      setLinhaEmOperacao(linha);
    }
  };

  const handleEncerrarViagem = () => {
    setLinhaEmOperacao(null);
  };

  const handleEnviarAlerta = async () => {
    if (!tipoAlerta || !descAlerta) {
      alert("Por favor, preencha o tipo e a descrição do alerta.");
      return;
    }
    
    setIsSubmittingAlert(true);
    try {
      await enviarAlertaAPI({
        idLinha: linhaEmOperacao?.idLinha,
        tipo: tipoAlerta,
        descricao: descAlerta,
      });
      alert("Alerta enviado com sucesso!");
      
      setTipoAlerta("");
      setDescAlerta("");
    } catch (error) {
      console.error("Erro ao enviar alerta:", error);
      alert("Erro ao enviar alerta.");
    } finally {
      setIsSubmittingAlert(false);
    }
  };

  if (loading) {
    return <p className="text-center p-12">Carregando linhas disponíveis...</p>;
  }

  
  if (linhaEmOperacao) {
    return (
      <main className="container mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto border-l-4 border-l-black -600">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Painel de Operação</span>
              <Badge className="bg-black -600 text-white hover:bg-blue-700">
                Em Operação
              </Badge>
            </CardTitle>
            <CardDescription>
              Linha: <span className="font-semibold text-gray-800">{linhaEmOperacao.nome} ({linhaEmOperacao.numero})</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
           
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="h-20 text-lg">
                  <AlertTriangle className="h-5 w-5 mr-2" /> Reportar Incidente
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reportar Novo Incidente</AlertDialogTitle>
                  <AlertDialogDescription>
                    O alerta será enviado aos passageiros e administradores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tipo-alerta">Tipo de Alerta</Label>
                    <Select value={tipoAlerta} onValueChange={setTipoAlerta}>
                      <SelectTrigger id="tipo-alerta">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATRASO">Atraso</SelectItem>
                        <SelectItem value="INCIDENTE">Incidente Técnico</SelectItem>
                        <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                        <SelectItem value="SEGURANCA">Segurança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc-alerta">Descrição Breve</Label>
                    <Input 
                      id="desc-alerta" 
                      placeholder="Ex: Falha no ar condicionado VLT-04" 
                      value={descAlerta}
                      onChange={(e) => setDescAlerta(e.target.value)}
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEnviarAlerta} disabled={isSubmittingAlert}>
                    {isSubmittingAlert ? "Enviando..." : "Enviar Alerta"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="secondary" className="h-20 text-lg" disabled>
              <Clock className="h-5 w-5 mr-2" /> Comunicar Atraso (Em breve)
            </Button>
            
          </CardContent>
          
             <Button variant="outline" onClick={handleEncerrarViagem} className="w-full">
               <LogOut className="h-4 w-4 mr-2" /> Encerrar Viagem
             </Button>
          
        </Card>
      </main>
    );
  }

  
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Iniciar Viagem
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Selecione a linha que você está iniciando para ativar seu painel de operação.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {linhas.map((linha) => (
          <Card key={linha.idLinha} className="flex flex-col">
            <CardHeader>
              <CardTitle>{linha.nome}</CardTitle>
              <CardDescription>Código: {linha.numero}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              
              <p className="text-sm text-gray-500">Pronto para iniciar.</p>
            </CardContent>
            
              <Button className="w-full" onClick={() => handleIniciarViagem(linha)}>
                <PlayCircle className="h-5 w-5 mr-2" /> Iniciar Viagem
              </Button>
           
          </Card>
        ))}
      </div>
    </main>
  );
}