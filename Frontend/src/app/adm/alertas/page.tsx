"use client";

import { useEffect, useState } from "react";
import { 
  getAlertas, createAlerta, deleteAlerta, 
  getIncidentesPendentes, atualizarStatusIncidente, 
  Alerta, IncidenteView 
} from "@/services/vltService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function GerenciarAlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [pendentes, setPendentes] = useState<IncidenteView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const [alertasData, incidentesData] = await Promise.all([
        getAlertas(),
        getIncidentesPendentes()
      ]);
      setAlertas(alertasData);
      setPendentes(incidentesData);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  }

  const handleAprovar = async (id: number) => {
    if(!confirm("Aprovar e publicar para os passageiros?")) return;
    await atualizarStatusIncidente(id, "PUBLICADO");
    alert("Aprovado!");
    carregarDados();
  };

  const handleRejeitar = async (id: number) => {
    if(!confirm("Rejeitar incidente?")) return;
    await atualizarStatusIncidente(id, "REJEITADO");
    carregarDados();
  };

  const handleDeletar = async (id: number) => {
    if(confirm("Apagar alerta?")) {
      await deleteAlerta(id);
      carregarDados();
    }
  };

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Central de Monitoramento</h1>
      
      <Tabs defaultValue="pendentes">
        <TabsList className="mb-4">
          <TabsTrigger value="pendentes">Pendentes de Aprovação ({pendentes.length})</TabsTrigger>
          <TabsTrigger value="ativos">Alertas Ativos ({alertas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="space-y-4">
          {pendentes.length === 0 && <p className="text-gray-500">Nenhum incidente pendente.</p>}
          {pendentes.map((inc) => (
            <Card key={inc.idIncidente} className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600"/> Incidente Reportado
                </CardTitle>
                <CardDescription>Por: {inc.condutorNome} em {new Date(inc.dataHora).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-lg">{inc.descricao}</p>
                <div className="flex gap-3">
                  <Button onClick={() => handleAprovar(inc.idIncidente)} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4"/> Aprovar e Publicar
                  </Button>
                  <Button variant="outline" onClick={() => handleRejeitar(inc.idIncidente)} className="text-red-600">
                    <XCircle className="mr-2 h-4 w-4"/> Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ativos" className="space-y-4">
          {alertas.map((alerta) => (
            <Card key={alerta.idAlerta}>
              <CardContent className="flex justify-between items-center pt-6">
                <div>
                  <h3 className="font-bold">{alerta.titulo}</h3>
                  <p>{alerta.mensagem}</p>
                  <span className="text-xs text-gray-400">{new Date(alerta.dataHoraEnvio).toLocaleString()}</span>
                </div>
                <Button variant="ghost" onClick={() => handleDeletar(alerta.idAlerta)}>
                  <Trash2 className="h-5 w-5 text-red-500"/>
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}