"use client";

import { useEffect, useState } from "react";
import { 
  getAlertas, 

  createAlerta, 

  deleteAlerta, 

  getIncidentesPendentes, 

  atualizarStatusIncidente,

  Alerta,

  IncidenteView

} from "@/services/vltService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose 
} from "@/components/ui/sheet";
import { AlertTriangle, Trash2, Plus, CheckCircle, XCircle, Megaphone, Clock, User } from "lucide-react";

export default function GerenciarAlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [pendentes, setPendentes] = useState<IncidenteView[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados do formulário manual
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const ADMIN_ID_FIXO = 1; // Em prod, pegar do contexto de auth

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const [alertasData, incidentesData] = await Promise.all([
        getAlertas(),
        getIncidentesPendentes()
      ]);
      
      setAlertas(alertasData);
      setPendentes(incidentesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  // 1. Aprovar Incidente (Vira Alerta)
  const handleAprovar = async (inc: IncidenteView) => {
    if(!confirm("Confirma a publicação deste incidente?")) return;
    try {
      await atualizarStatusIncidente(inc.idIncidente, "PUBLICADO");
      alert("Aprovado com sucesso!");
      carregarDados();
    } catch (e) { alert("Erro ao aprovar."); }
  };

  // 2. Rejeitar Incidente
  const handleRejeitar = async (id: number) => {
    if(!confirm("Rejeitar este reporte?")) return;
    try {
      await atualizarStatusIncidente(id, "REJEITADO");
      carregarDados();
    } catch (e) { alert("Erro ao rejeitar."); }
  };

  // 3. Criar Alerta Manual
  const handleCriarManual = async () => {
    if (!titulo || !mensagem) return;
    setIsSubmitting(true);
    try {
      await createAlerta({ titulo, mensagem, administradorId: ADMIN_ID_FIXO });
      alert("Alerta criado!");
      setTitulo("");
      setMensagem("");
      carregarDados();
    } catch (e) { alert("Erro ao criar."); }
    finally { setIsSubmitting(false); }
  };

  
  const handleDeletarAlerta = async (id: number) => {
    if(confirm("Apagar este alerta?")) {
      await deleteAlerta(id);
      carregarDados();
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Carregando painel...</div>;

  return (
    <main className="container mx-auto px-6 py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Central de Operações</h1>
          <p className="text-gray-500">Gerencie incidentes e comunique os passageiros.</p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Novo Comunicado
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader><SheetTitle>Novo Comunicado</SheetTitle></SheetHeader>
            <div className="grid gap-4 py-6">
              <div className="grid gap-2">
                <Label>Título</Label>
                <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Atraso Linha Sul" />
              </div>
              <div className="grid gap-2">
                <Label>Mensagem</Label>
                <Input value={mensagem} onChange={e => setMensagem(e.target.value)} placeholder="Detalhes..." />
              </div>
            </div>
            <SheetFooter>
              <Button onClick={handleCriarManual} disabled={isSubmitting}>Publicar</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="pendentes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="pendentes" className="text-base">
            Aprovações Pendentes 
            {pendentes.length > 0 && <Badge className="ml-2 bg-red-600">{pendentes.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="ativos" className="text-base">
            Alertas Ativos no App
          </TabsTrigger>
        </TabsList>

        {/* ABA PENDENTES (FLUXO DE APROVAÇÃO) */}
        <TabsContent value="pendentes" className="space-y-4">
          {pendentes.length === 0 ? (
            <Card className="border-dashed bg-slate-50 p-8 text-center text-gray-500">
              <p>Nenhum incidente aguardando aprovação.</p>
            </Card>
          ) : (
            pendentes.map((inc) => (
              <Card key={inc.idIncidente} className="border-l-4 border-l-orange-400">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                      <AlertTriangle className="h-5 w-5" /> Reporte de Incidente
                    </CardTitle>
                    <Badge variant="outline" className="border-orange-300 text-orange-600">PENDENTE</Badge>
                  </div>
                  <CardDescription>
                    Reportado por: <b>{inc.condutorNome || "Condutor"}</b> às {new Date(inc.dataHora).toLocaleTimeString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-3 rounded border mb-4 text-gray-800">
                    {inc.descricao}
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => handleRejeitar(inc.idIncidente)} className="text-red-600 hover:bg-red-50 border-red-200">
                      <XCircle className="mr-2 h-4 w-4" /> Rejeitar
                    </Button>
                    <Button onClick={() => handleAprovar(inc)} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4" /> Aprovar e Publicar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ABA ATIVOS */}
        <TabsContent value="ativos" className="space-y-4">
          {alertas.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum alerta público ativo.</p>
          ) : (
            alertas.map((alerta) => (
              <Card key={alerta.idAlerta} className="flex flex-col md:flex-row justify-between p-4 items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={alerta.incidenteDescricao ? "destructive" : "default"}>
                      {alerta.incidenteDescricao ? "INCIDENTE" : "COMUNICADO"}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {new Date(alerta.dataHoraEnvio).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{alerta.titulo}</h3>
                  <p className="text-sm text-gray-600">{alerta.mensagem}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeletarAlerta(alerta.idAlerta)}>
                  <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-600" />
                </Button>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}