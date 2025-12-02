"use client";

import { useEffect, useState } from "react";
import { 
  getViagensDoCondutor, 
  getCondutorByEmail, 
  updateViagem,
  createIncidente,
  Viagem 
} from "@/services/vltService";
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
import { PlayCircle, AlertTriangle, LogOut, Clock, Calendar } from "lucide-react";

export default function CondutorOperacaoPage() {
  // Mudamos de 'linhas' para 'viagens'
  const [viagensAgendadas, setViagensAgendadas] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viagemEmOperacao, setViagemEmOperacao] = useState<Viagem | null>(null);

  // Estados do Incidente
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [descAlerta, setDescAlerta] = useState("");
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);

  useEffect(() => {
    async function carregarEscala() {
      try {
        // 1. Pegar Email do Token
        const token = localStorage.getItem("token");
        if (!token) return;
        const base64Url = token.split('.')[1];
        const jsonPayload = JSON.parse(
          decodeURIComponent(
            window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/'))
          )
        );
        const email = jsonPayload.sub;

        // 2. Pegar ID do Condutor
        const condutor = await getCondutorByEmail(email);
        
        // 3. Pegar Viagens deste Condutor
        const todasViagens = await getViagensDoCondutor(condutor.idCondutor);

        // 4. Filtrar: O que é futuro vs O que já está rodando
        // Removido uso de v.status
        const emAndamento = null;
        const agendadas = todasViagens;

        if (emAndamento) {
          setViagemEmOperacao(emAndamento);
        }
        
        setViagensAgendadas(agendadas);

      } catch (error) {
        console.error("Erro ao carregar escala:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarEscala();
  }, []);

  const handleIniciarViagem = async (viagem: Viagem) => {
    const horario = new Date(viagem.dataHoraInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (window.confirm(`Iniciar viagem prevista para ${horario} na linha ${viagem.linhaNome}?`)) {
      try {
        // Atualiza status no backend
        await updateViagem(viagem.idViagem, { status: "EM_VIAGEM" });
        
        // Atualiza tela local (sem status no tipo Viagem)
        setViagemEmOperacao(viagem);
      } catch (error) {
        alert("Erro ao iniciar viagem. Tente novamente.");
      }
    }
  };

  const handleEncerrarViagem = async () => {
    if(!viagemEmOperacao) return;
    if(!confirm("Deseja realmente encerrar a viagem no terminal?")) return;

    try {
      await updateViagem(viagemEmOperacao.idViagem, { status: "CONCLUIDA" });
      setViagemEmOperacao(null);
      window.location.reload(); // Recarrega para pegar novas viagens
    } catch (error) {
      alert("Erro ao encerrar viagem.");
    }
  };

  const handleEnviarAlerta = async () => {
    if (!tipoAlerta || !descAlerta) {
      alert("Preencha o tipo e a descrição.");
      return;
    }
    
    setIsSubmittingAlert(true);
    try {
      // Se for atraso, muda o status da viagem no backend
      if (tipoAlerta === "ATRASO" && viagemEmOperacao) {
        await updateViagem(viagemEmOperacao.idViagem, { status: "ATRASADO" });
        // Não guarda status no objeto em memória
        setViagemEmOperacao(viagemEmOperacao);
      }

      await createIncidente({
        descricao: `[${tipoAlerta}] ${descAlerta} - Viagem ID: ${viagemEmOperacao?.idViagem}`,
        status: "PENDENTE"
      });

      alert("Incidente reportado!");
      setTipoAlerta("");
      setDescAlerta("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert("Erro ao enviar reporte.");
    } finally {
      setIsSubmittingAlert(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando escala...</div>;

  // --- MODO: EM VIAGEM (Mantendo a estrutura do Card Grande) ---
  if (viagemEmOperacao) {
    return (
      <main className="container mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto border-l-4 border-l-green-600 shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Painel de Operação</span>
              <Badge className="bg-green-600 animate-pulse">
                EM VIAGEM
              </Badge>
            </CardTitle>
            <CardDescription>
              Linha: <span className="font-bold text-gray-900">{viagemEmOperacao.linhaNome}</span> <br/>
              VLT: {viagemEmOperacao.vltCodigo}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            
            {/* Mantido igual ao seu código original */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="h-24 text-lg w-full shadow-md">
                  <AlertTriangle className="h-8 w-8 mr-2" /> REPORTAR OCORRÊNCIA
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reportar Incidente</AlertDialogTitle>
                  <AlertDialogDescription>O alerta será enviado para o CCO.</AlertDialogDescription>
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
               <LogOut className="h-4 w-4 mr-2" /> Encerrar Viagem no Destino
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // --- MODO: SELEÇÃO DE VIAGEM (Lista de Viagens Agendadas) ---
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Minha Escala</h1>
      <p className="text-gray-500 mb-6">Selecione a viagem programada para iniciar.</p>
      
      {viagensAgendadas.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-slate-50">
          <p className="text-gray-500">Nenhuma viagem agendada para você no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {viagensAgendadas.map((viagem) => (
            <Card
              key={viagem.idViagem}
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => handleIniciarViagem(viagem)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">
                    {new Date(viagem.dataHoraInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Badge>
                  <Badge variant="secondary">{viagem.vltCodigo}</Badge>
                </div>
                <CardTitle className="text-lg">{viagem.linhaNome}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(viagem.dataHoraInicio).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <PlayCircle className="mr-2 h-4 w-4"/> Iniciar Viagem
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
