"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus, Edit, Trash2, Search, Bus, MapPin, Route, Train, Bell, Map as MapIcon, AlertTriangle, CheckCircle, XCircle, User, Mail, IdCard, Building, Hash, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getAlertas, 
  createAlerta, 
  deleteAlerta, 
  getIncidentesPendentes, 
  atualizarStatusIncidente,
  getLinhas, 
  getEstacoes, 
  createLinha, 
  updateLinha, 
  deleteLinha,
  getCondutores,
  createCondutor,
  updateCondutor,
  deleteCondutor,
  Alerta as AlertaType,
  IncidenteView as IncidenteViewType,
  Condutor as CondutorType,
  CriarCondutorData,
  CriarEstacaoData,
  createEstacao,
  updateEstacao,
  deleteEstacao,
  getVlts, 
  createVlt, 
  updateVlt, 
  deleteVlt,
  getViagens,
  createViagem,
  updateViagem,
  deleteViagem,
  Viagem as ViagemType
} from "@/services/vltService";

interface Linha {
  idLinha: number;
  nome: string;
  numero: string;
}

interface Estacao {
  idEstacao: number;
  nome: string;
  endereco: string;
  linha?: Linha;
}

interface Vlt {
idVlt: number;
codigo: string;
status: string | null;
localizacao: string | null;
}

interface Viagem {
  idViagem: number;
  dataHora: string;
  origem: string;
  destino: string;
  vlt?: Vlt;
  condutor?: { idCondutor: number; usuarioNome: string };
  status: string;
}

export default function GerenciamentoSistema() {
  const [activeTab, setActiveTab] = useState("condutores");

  
  const [searchTerm, setSearchTerm] = useState("");

  const [condutores, setCondutores] = useState<CondutorType[]>([]);
  const [condutoresLoading, setCondutoresLoading] = useState(false);
  const [condutorEditando, setCondutorEditando] = useState<CondutorType | null>(null);
  const [isSubmittingCondutor, setIsSubmittingCondutor] = useState(false);
  
  const [matricula, setMatricula] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [usuarioNome, setUsuarioNome] = useState("");
  const [usuarioEmail, setUsuarioEmail] = useState("");

  const [alertas, setAlertas] = useState<AlertaType[]>([]);
  const [pendentes, setPendentes] = useState<IncidenteViewType[]>([]);
  const [alertasLoading, setAlertasLoading] = useState(false);

  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [linhasLoading, setLinhasLoading] = useState(false);
  
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [estacoesLoading, setEstacoesLoading] = useState(false);
  const [estacaoEditando, setEstacaoEditando] = useState<Estacao | null>(null);
  const [isSubmittingEstacao, setIsSubmittingEstacao] = useState(false);

  const [nomeEstacao, setNomeEstacao] = useState("");
  const [enderecoEstacao, setEnderecoEstacao] = useState("");
  const [idLinhaEstacao, setIdLinhaEstacao] = useState<number | "">();

 const [vlts, setVlts] = useState<Vlt[]>([]);
  const [vltsFiltrados, setVltsFiltrados] = useState<Vlt[]>([]);
  const [vltLoading, setVltLoading] = useState(true);

  const [codigoVlt, setCodigoVlt] = useState("");
  const [statusVlt, setStatusVlt] = useState("ATIVO");
  const [localizacaoVlt, setLocalizacaoVlt] = useState("");

  const [vltEditando, setVltEditando] = useState(false);
  const [idVltEditando, setIdVltEditando] = useState<number | null>(null);

  const [isSubmittingVlt, setIsSubmittingVlt] = useState(false);
  const [searchTermVlt, setSearchTermVlt] = useState("");

  const [viagens, setViagens] = useState<ViagemType[]>([]);
  const [viagensFiltrados, setViagensFiltrados] = useState<ViagemType[]>([]);
  const [viagensLoading, setViagensLoading] = useState(false);
  const [viagemEditando, setViagemEditando] = useState<ViagemType | null>(null);
  const [isSubmittingViagem, setIsSubmittingViagem] = useState(false);

  const [dataHoraViagem, setDataHoraViagem] = useState("");
  const [origemViagem, setOrigemViagem] = useState("");
  const [destinoViagem, setDestinoViagem] = useState("");
  const [idVltViagem, setIdVltViagem] = useState<number>(0);
  const [idCondutorViagem, setIdCondutorViagem] = useState<number>(0);
  const [statusViagem, setStatusViagem] = useState("AGENDADA");
  const [searchTermViagem, setSearchTermViagem] = useState("");


  useEffect(() => {
    const carregarDadosPorTab = async () => {
      switch (activeTab) {
        case "alertas":
          await carregarAlertas();
          break;
        case "linhas":
        case "estacoes":
          await carregarLinhasComEstacoes();
          break;
        case "condutores":
          await carregarCondutores();
          break;
        case "vlts":
          await carregarVlts();
          break;
        case "viagens":
          await carregarViagens();
          break;
        default:
          break;
      }
    };

    carregarDadosPorTab(); 
  }, [activeTab]);

  useEffect(() => {
    const termo = searchTermVlt.toLowerCase();
    const filtrados = vlts.filter((v) =>
    v?.codigo?.toLowerCase().includes(termo)
    );
    setVltsFiltrados(filtrados);
  }, [searchTermVlt, vlts]);

  useEffect(() => {
    const termo = searchTermViagem.toLowerCase();
    const filtrados = viagens.filter(viagem =>
      viagem.origem.toLowerCase().includes(termo) ||
      viagem.destino.toLowerCase().includes(termo) ||
      viagem.vlt?.numero.toLowerCase().includes(termo) ||
      viagem.condutor?.usuarioNome.toLowerCase().includes(termo)
    );
    setViagensFiltrados(filtrados);
  }, [searchTermViagem, viagens]);

  

  async function carregarCondutores() {
    setCondutoresLoading(true);
    try {
      const condutoresData = await getCondutores();
      setCondutores(condutoresData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao carregar condutores:", error);
      alert("Erro ao carregar condutores: " + (error.message || "Verifique a conexão."));
    } finally {
      setCondutoresLoading(false);
    }
  }

  const resetFormCondutor = () => {
    setMatricula("");
    setUsuarioId("");
    setUsuarioNome("");
    setUsuarioEmail("");
    setCondutorEditando(null);
  };

  const handleSubmitCondutor = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!matricula || !usuarioId) {
      alert("Por favor, preencha a matrícula e o ID do usuário.");
      return;
    }

    const usuarioIdNum = parseInt(usuarioId);
    if (isNaN(usuarioIdNum)) {
      alert("ID do usuário deve ser um número válido.");
      return;
    }

    setIsSubmittingCondutor(true);

    try {
      const condutorData: CriarCondutorData = {
        matricula,
        usuarioId: usuarioIdNum
      };

      if (condutorEditando) {
        await updateCondutor(condutorEditando.idCondutor, condutorData);
        alert("Condutor atualizado com sucesso!");
      } else {
        await createCondutor(condutorData);
        alert("Condutor cadastrado com sucesso!");
      }
      
      resetFormCondutor();
      carregarCondutores();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar condutor:", error);
      alert("Erro ao salvar condutor: " + (error.message || "Tente novamente."));
    } finally {
      setIsSubmittingCondutor(false);
    }
  };

  const handleEditCondutor = (condutor: CondutorType) => {
    setCondutorEditando(condutor);
    setMatricula(condutor.matricula);
    setUsuarioId(condutor.usuarioId.toString());
    setUsuarioNome(condutor.usuarioNome);
    setUsuarioEmail(condutor.usuarioEmail);
  };

  const handleDeleteCondutor = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este condutor?")) {
      return;
    }

    try {
      await deleteCondutor(id);
      alert("Condutor deletado com sucesso!");
      carregarCondutores();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao deletar condutor:", error);
      alert("Erro ao deletar condutor: " + (error.message || "Tente novamente."));
    }
  };

  const condutoresFiltrados = condutores.filter(condutor =>
    condutor.usuarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condutor.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condutor.usuarioEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // FUNÇÕES - ALERTAS

  async function carregarAlertas() {
    setAlertasLoading(true);
    try {
      const [alertasData, incidentesData] = await Promise.all([
        getAlertas(),
        getIncidentesPendentes()
      ]);
      setAlertas(alertasData);
      setPendentes(incidentesData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) { 
      console.error("Erro ao carregar alertas:", e); 
      alert("Erro ao carregar alertas: " + (e.message || "Verifique a conexão."));
    } finally { 
      setAlertasLoading(false); 
    }
  }

  const handleAprovar = async (id: number) => {
    if(!confirm("Aprovar e publicar para os passageiros?")) return;
    try {
      await atualizarStatusIncidente(id, "PUBLICADO");
      alert("Aprovado!");
      carregarAlertas();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao aprovar:", error);
      alert("Erro ao aprovar incidente: " + (error.message || "Tente novamente."));
    }
  };

  const handleRejeitar = async (id: number) => {
    if(!confirm("Rejeitar incidente?")) return;
    try {
      await atualizarStatusIncidente(id, "REJEITADO");
      carregarAlertas();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao rejeitar:", error);
      alert("Erro ao rejeitar incidente: " + (error.message || "Tente novamente."));
    }
  };

  const handleDeletarAlerta = async (id: number) => {
    if(confirm("Apagar alerta?")) {
      try {
        await deleteAlerta(id);
        carregarAlertas();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Erro ao deletar alerta:", error);
        alert("Erro ao deletar alerta: " + (error.message || "Tente novamente."));
      }
    }
  };


  // FUNÇÕES - LINHAS

  const resetForm = () => {
    setNome("");
    setNumero("");
    setEditingId(null);
  };

  const handleSubmitLinha = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nome || !numero) {
      alert("Por favor, preencha o nome e o número da linha.");
      return;
    }
    setIsSubmitting(true);

    try {
      const linhaData = { nome, numero };
      if (editingId) {
        await updateLinha(editingId, linhaData);
        alert("Linha atualizada com sucesso!");
      } else {
        await createLinha(linhaData);
        alert("Linha cadastrada com sucesso!");
      }
      resetForm();
      carregarLinhas();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar linha:", error);
      alert("Erro ao salvar linha: " + (error.message || "Você precisa estar logado como Administrador."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (linha: Linha) => {
    setEditingId(linha.idLinha);
    setNome(linha.nome);
    setNumero(linha.numero);
  };

  const handleDeleteLinha = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar esta linha?")) {
      return;
    }

    try {
      await deleteLinha(id);
      alert("Linha deletada com sucesso!");
      carregarLinhas();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao deletar linha:", error);
      alert("Erro ao deletar linha: " + (error.message || "Você precisa estar logado como Administrador."));
    }
  };

  const carregarLinhas = async () => {
    try {
      const data = await getLinhas();
      setLinhas(data);
    } catch (err) {
      console.error("Erro ao carregar linhas", err);
    }
  };


  // FUNÇÕES - ESTAÇÕES

  const resetFormEstacao = () => {
    setNomeEstacao("");
    setEnderecoEstacao("");
    setIdLinhaEstacao("");
    setEstacaoEditando(null);
  };

  const handleSubmitEstacao = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!nomeEstacao || !enderecoEstacao || !idLinhaEstacao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmittingEstacao(true);

    try {
      const estacaoData: CriarEstacaoData = {
        nome: nomeEstacao,
        endereco: enderecoEstacao,
        idLinha: Number(idLinhaEstacao)
      };

      if (estacaoEditando) {
        await updateEstacao(estacaoEditando.idEstacao, estacaoData);
        alert("Estação atualizada com sucesso!");
      } else {
        await createEstacao(estacaoData);
        alert("Estação cadastrada com sucesso!");
      }
      
      resetFormEstacao();
      carregarLinhas();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar estação:", error);
      alert("Erro ao salvar estação: " + (error.message || "Tente novamente."));
    } finally {
      setIsSubmittingEstacao(false);
    }
  };

  const handleEditEstacao = (estacao: Estacao) => {
    setEstacaoEditando(estacao);
    setNomeEstacao(estacao.nome);
    setEnderecoEstacao(estacao.endereco);
    setIdLinhaEstacao(estacao.linha?.idLinha || "");
  };

  const handleDeleteEstacao = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar esta estação?")) {
      return;
    }

    try {
      await deleteEstacao(id);
      alert("Estação deletada com sucesso!");
      carregarLinhas();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao deletar estação:", error);
      alert("Erro ao deletar estação: " + (error.message || "Tente novamente."));
    }
  };

  const estacoesFiltradas = estacoes.filter(estacao =>
    estacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estacao.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estacao.linha?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const carregarLinhasComEstacoes = async () => {
    setLinhasLoading(true);
    try {
      const [linhasData, estacoesData] = await Promise.all([
        getLinhas(),
        getEstacoes(),
      ]);
      setLinhas(linhasData);
      setEstacoes(estacoesData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados: " + (error.message || "Verifique se o servidor está no Ar!"));
    } finally {
      setLinhasLoading(false);
    }
  };


  const resetFormVlt = () => {
    setVltEditando(false);
    setIdVltEditando(null);
    setCodigoVlt("");
    setStatusVlt("ATIVO");
    setLocalizacaoVlt("");
  };

    const handleSubmitVlt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingVlt(true);

    const payload = {
      codigo: codigoVlt,
      status: statusVlt,
      localizacao: localizacaoVlt,
    };

    try {
      if (vltEditando && idVltEditando !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateVlt(idVltEditando, payload as any);
        alert("VLT atualizado com sucesso!");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createVlt(payload as any);
        alert("VLT cadastrado com sucesso!");
      }

      resetFormVlt();
      carregarVlts();
    } catch (err) {
      console.error("Erro ao salvar VLT", err);
      alert(
        "Erro ao salvar VLT: " +
          (err instanceof Error ? err.message : "Erro desconhecido")
      );
    } finally {
      setIsSubmittingVlt(false);
    }
  };
  
  const handleEditVlt = (vlt: Vlt) => {
    setVltEditando(true);
    setIdVltEditando(vlt.idVlt);
    setCodigoVlt(vlt.codigo || "");
    setStatusVlt(vlt.status || "ATIVO");
    setLocalizacaoVlt(vlt.localizacao || "");
  };

  const handleDeleteVlt = async (idVlt: number) => {
    if (!confirm("Deseja realmente excluir este VLT?")) return;
    try {
      await deleteVlt(idVlt);
      alert("VLT deletado com sucesso!");
      carregarVlts();
    } catch (err) {
      console.error("Erro ao deletar VLT", err);
      alert("Erro ao deletar VLT: " + (err instanceof Error ? err.message : "Erro desconhecido"));
    }
  };

  const carregarVlts = async () => {
    try {
      setVltLoading(true);
      const data = await getVlts();
      setVlts(data);
      setVltsFiltrados(data);
    } catch (err) {
      console.error("Erro ao carregar VLTs", err);
      alert(
        "Erro ao carregar VLTs: " +
          (err instanceof Error ? err.message : "Erro desconhecido")
      );
    } finally {
      setVltLoading(false);
    }
  };

  async function carregarViagens() {
    setViagensLoading(true);
    try {
      const viagensData = await getViagens();
      setViagens(viagensData);
      setViagensFiltrados(viagensData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao carregar viagens:", error);
      alert("Erro ao carregar viagens: " + (error.message || "Verifique a conexão."));
    } finally {
      setViagensLoading(false);
    }
  }

  const resetFormViagem = () => {
    setDataHoraViagem("");
    setOrigemViagem("");
    setDestinoViagem("");
    setIdVltViagem(0);
    setIdCondutorViagem(0);
    setStatusViagem("AGENDADA");
    setViagemEditando(null);
  };

  const handleSubmitViagem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!dataHoraViagem || !origemViagem || !destinoViagem || !idVltViagem || !idCondutorViagem) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmittingViagem(true);

    try {
      const viagemData = {
        dataHora: dataHoraViagem,
        origem: origemViagem,
        destino: destinoViagem,
        idVlt: idVltViagem,
        idCondutor: idCondutorViagem,
        status: statusViagem
      };

      if (viagemEditando) {
        await updateViagem(viagemEditando.idViagem, viagemData);
        alert("Viagem atualizada com sucesso!");
      } else {
        await createViagem(viagemData);
        alert("Viagem cadastrada com sucesso!");
      }
      
      resetFormViagem();
      carregarViagens();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar viagem:", error);
      alert("Erro ao salvar viagem: " + (error.message || "Tente novamente."));
    } finally {
      setIsSubmittingViagem(false);
    }
  };

  const handleEditViagem = (viagem: ViagemType) => {
    setViagemEditando(viagem);
    setDataHoraViagem(viagem.dataHora);
    setOrigemViagem(viagem.origem);
    setDestinoViagem(viagem.destino);
    setIdVltViagem(viagem.vlt?.idVlt || 0);
    setIdCondutorViagem(viagem.condutor?.idCondutor || 0);
    setStatusViagem(viagem.status);
  };

  const handleDeleteViagem = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar esta viagem?")) {
      return;
    }

    try {
      await deleteViagem(id);
      alert("Viagem deletada com sucesso!");
      carregarViagens();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao deletar viagem:", error);
      alert("Erro ao deletar viagem: " + (error.message || "Tente novamente."));
    }
  };


  return (
    <div className="pl-35 justify-center w-350 p-6">
      {/*  HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Painel do administrador
        </h1>
        <p className="text-gray-600">
          Gerencie condutores, estações, VLTs, viagens, alertas e linhas
        </p>
      </div>

      {/* TABS NAVIGATION */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="condutores" className="flex items-center gap-2">
            <Bus className="w-4 h-4" />
            <span className="hidden sm:inline">Condutores</span>
          </TabsTrigger>
          <TabsTrigger value="estacoes" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Estações</span>
          </TabsTrigger>
          <TabsTrigger value="vlts" className="flex items-center gap-2">
            <Train className="w-4 h-4" />
            <span className="hidden sm:inline">VLTs</span>
          </TabsTrigger>
          <TabsTrigger value="viagens" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            <span className="hidden sm:inline">Viagens</span>
          </TabsTrigger>
          <TabsTrigger value="alertas" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="linhas" className="flex items-center gap-2">
            <MapIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Linhas</span>
          </TabsTrigger>
        </TabsList>

        {/*TABS CONTENT*/}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          
          {/*TAB: CONDUTORES */}
          <TabsContent value="condutores" className="p-6">
            {condutoresLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Carregando condutores...</p>
              </div>
            ) : (
              <>
                <Card className="mb-8">
                  <form onSubmit={handleSubmitCondutor}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {condutorEditando ? "Editar Condutor" : "Cadastrar Novo Condutor"}
                      </CardTitle>
                      <CardDescription>
                        {condutorEditando ? "Atualize os dados do condutor" : "Preencha os dados para adicionar um novo condutor"}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="matricula" className="flex items-center gap-2">
                          <IdCard className="w-4 h-4" />
                          Matrícula *
                        </Label>
                        <Input
                          id="matricula"
                          placeholder="Ex: CON-001"
                          value={matricula}
                          onChange={(e) => setMatricula(e.target.value)}
                          disabled={isSubmittingCondutor}
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="usuarioId" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          ID do Usuário *
                        </Label>
                        <Input
                          id="usuarioId"
                          type="number"
                          placeholder="Ex: 123"
                          value={usuarioId}
                          onChange={(e) => setUsuarioId(e.target.value)}
                          disabled={isSubmittingCondutor}
                          required
                        />
                      </div>
                      {condutorEditando && (
                        <>
                          <div className="grid gap-3">
                            <Label htmlFor="usuarioNome" className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Nome do Usuário
                            </Label>
                            <Input
                              id="usuarioNome"
                              placeholder="Nome do usuário"
                              value={usuarioNome}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="usuarioEmail" className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email do Usuário
                            </Label>
                            <Input
                              id="usuarioEmail"
                              type="email"
                              placeholder="email@exemplo.com"
                              value={usuarioEmail}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                      {condutorEditando && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetFormCondutor}
                          disabled={isSubmittingCondutor}
                        >
                          Cancelar Edição
                        </Button>
                      )}
                      <Button type="submit" disabled={isSubmittingCondutor}>
                        {condutorEditando ? "Salvar Alterações" : "Cadastrar Condutor"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Pesquisar condutores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {condutoresFiltrados.length} de {condutores.length} condutores
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Condutores Cadastrados
                  </h2>

                  {condutoresFiltrados.length === 0 ? (
                    <div className="text-center py-12">
                      <User className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">
                        {condutores.length === 0 ? "Nenhum condutor cadastrado" : "Nenhum condutor encontrado"}
                      </h3>
                      <p className="mt-2 text-gray-500">
                        {condutores.length === 0 
                          ? "Comece cadastrando o primeiro condutor." 
                          : "Tente ajustar os termos da pesquisa."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {condutoresFiltrados.map((condutor) => (
                        <Card key={condutor.idCondutor} className="relative">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                  <User className="w-5 h-5 text-blue-600" />
                                  {condutor.usuarioNome}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{condutor.usuarioEmail}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditCondutor(condutor)}
                                  title="Editar Condutor"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteCondutor(condutor.idCondutor)}
                                  title="Deletar Condutor"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Matrícula:</span>
                                <span className="font-medium">{condutor.matricula}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">ID Usuário:</span>
                                <span className="font-medium">{condutor.usuarioId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">ID Condutor:</span>
                                <span className="font-medium">{condutor.idCondutor}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* TAB: ALERTAS */}
          <TabsContent value="alertas" className="p-6">
            {alertasLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Carregando alertas...</p>
              </div>
            ) : (
              <Tabs defaultValue="pendentes">
                <TabsList className="mb-4">
                  <TabsTrigger value="pendentes">
                    Pendentes de Aprovação ({pendentes.length})
                  </TabsTrigger>
                  <TabsTrigger value="ativos">
                    Alertas Ativos ({alertas.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pendentes" className="space-y-4">
                  {pendentes.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Nenhum incidente pendente.</p>
                  )}
                  {pendentes.map((inc) => (
                    <Card key={inc.idIncidente} className="border-l-4 border-l-yellow-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="text-yellow-600"/> Incidente Reportado
                        </CardTitle>
                        <CardDescription>
                          {inc.condutorNome && `Por: ${inc.condutorNome} em `}{new Date(inc.dataHora).toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 text-lg">{inc.descricao}</p>
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => handleAprovar(inc.idIncidente)} 
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="mr-2 h-4 w-4"/> Aprovar e Publicar
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleRejeitar(inc.idIncidente)} 
                            className="text-red-600"
                          >
                            <XCircle className="mr-2 h-4 w-4"/> Rejeitar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="ativos" className="space-y-4">
                  {alertas.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Nenhum alerta ativo.</p>
                  )}
                  {alertas.map((alerta) => (
                    <Card key={alerta.idAlerta}>
                      <CardContent className="flex justify-between items-center pt-6">
                        <div>
                          <h3 className="font-bold text-lg">{alerta.titulo}</h3>
                          <p className="text-gray-700 mt-1">{alerta.mensagem}</p>
                          <span className="text-xs text-gray-400 block mt-2">
                            {new Date(alerta.dataHoraEnvio).toLocaleString()}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleDeletarAlerta(alerta.idAlerta)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5"/>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>

          {/* TAB: LINHAS */}
          <TabsContent value="linhas" className="p-6">
            {linhasLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Carregando linhas...</p>
              </div>
            ) : (
              <>
                <Card className="mb-8">
                  <form onSubmit={handleSubmitLinha}>
                    <CardHeader>
                      <CardTitle>
                        {editingId ? "Editar Linha" : "Cadastrar Nova Linha"}
                      </CardTitle>
                      <CardDescription>
                        Preencha os dados abaixo para {editingId ? "salvar as alterações" : "adicionar uma nova linha"}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="nome">Nome da Linha</Label>
                        <Input
                          id="nome"
                          placeholder="Ex: Parangaba-Mucuripe"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="numero">Número</Label>
                        <Input
                          id="numero"
                          placeholder="Ex: VLT-01"
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                      {editingId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                          disabled={isSubmitting}
                        >
                          Cancelar Edição
                        </Button>
                      )}
                      <Button type="submit" disabled={isSubmitting}>
                        {editingId ? "Salvar Alterações" : "Cadastrar Linha"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Linhas Cadastradas ({linhas.length})
                  </h2>

                  {linhas.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhuma linha cadastrada.</p>
                  ) : (
                    linhas.map((linha) => {
                      const estacoesDaLinha = estacoes.filter(
                        (e) => e.linha?.idLinha === linha.idLinha
                      );

                      return (
                        <Card key={linha.idLinha} className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                {linha.nome}
                              </h3>
                              <p className="text-gray-500">
                                Código: {linha.numero || "N/A"}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(linha)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteLinha(linha.idLinha)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </Button>
                            </div>
                          </div>

                          {estacoesDaLinha.length > 0 ? (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-3">
                                Estações ({estacoesDaLinha.length})
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {estacoesDaLinha.map((estacao) => (
                                  <div
                                    key={estacao.idEstacao}
                                    className="bg-gray-50 border rounded-lg p-3"
                                  >
                                    <p className="font-medium text-gray-800">
                                      {estacao.nome}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {estacao.endereco || "Endereço não informado"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">
                              Nenhuma estação cadastrada nesta linha.
                            </p>
                          )}
                        </Card>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* TAB: ESTAÇÕES */}
          <TabsContent value="estacoes" className="p-6">
            {linhasLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Carregando estações...</p>
              </div>
            ) : (
              <>
                <Card className="mb-8">
                  <form onSubmit={handleSubmitEstacao}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        {estacaoEditando ? "Editar Estação" : "Cadastrar Nova Estação"}
                      </CardTitle>
                      <CardDescription>
                        {estacaoEditando ? "Atualize os dados da estação" : "Preencha os dados para adicionar uma nova estação"}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="nomeEstacao" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Nome da Estação *
                        </Label>
                        <Input
                          id="nomeEstacao"
                          placeholder="Ex: Estação Central"
                          value={nomeEstacao}
                          onChange={(e) => setNomeEstacao(e.target.value)}
                          disabled={isSubmittingEstacao}
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="enderecoEstacao" className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Endereço *
                        </Label>
                        <Input
                          id="enderecoEstacao"
                          placeholder="Ex: Rua Principal, 123"
                          value={enderecoEstacao}
                          onChange={(e) => setEnderecoEstacao(e.target.value)}
                          disabled={isSubmittingEstacao}
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="idLinhaEstacao" className="flex items-center gap-2">
                          <MapIcon className="w-4 h-4" />
                          Linha *
                        </Label>
                        <select
                          id="idLinhaEstacao"
                          value={idLinhaEstacao}
                          onChange={(e) => setIdLinhaEstacao(Number(e.target.value) || "")}
                          disabled={isSubmittingEstacao}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Selecione uma linha</option>
                          {linhas.map((linha) => (
                            <option key={linha.idLinha} value={linha.idLinha}>
                              {linha.nome} ({linha.numero})
                            </option>
                          ))}
                        </select>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                      {estacaoEditando && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetFormEstacao}
                          disabled={isSubmittingEstacao}
                        >
                          Cancelar Edição
                        </Button>
                      )}
                      <Button type="submit" disabled={isSubmittingEstacao}>
                        {estacaoEditando ? "Salvar Alterações" : "Cadastrar Estação"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Pesquisar estações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {estacoesFiltradas.length} de {estacoes.length} estações
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Estações Cadastradas
                  </h2>

                  {estacoesFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">
                        {estacoes.length === 0 ? "Nenhuma estação cadastrada" : "Nenhuma estação encontrada"}
                      </h3>
                      <p className="mt-2 text-gray-500">
                        {estacoes.length === 0 
                          ? "Comece cadastrando a primeira estação." 
                          : "Tente ajustar os termos da pesquisa."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {estacoesFiltradas.map((estacao) => (
                        <Card key={estacao.idEstacao} className="relative">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                  <MapPin className="w-5 h-5 text-blue-600" />
                                  {estacao.nome}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{estacao.endereco}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditEstacao(estacao)}
                                  title="Editar Estação"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteEstacao(estacao.idEstacao)}
                                  title="Deletar Estação"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Linha:</span>
                                <span className="font-medium">{estacao.linha?.nome || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Código da Linha:</span>
                                <span className="font-medium">{estacao.linha?.numero || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">ID Estação:</span>
                                <span className="font-medium">{estacao.idEstacao}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/*  TAB: VLTs */}
          <TabsContent value="vlts" className="p-6">
            {vltLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Carregando VLTs...</p>
              </div>
            ) : (
              <>
                <Card className="mb-8">
                  <form onSubmit={handleSubmitVlt}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Train className="w-5 h-5" />
                        {vltEditando ? "Editar VLT" : "Cadastrar Novo VLT"}
                      </CardTitle>
                      <CardDescription>
                        {vltEditando
                          ? "Atualize os dados do VLT"
                          : "Preencha os dados para adicionar um novo VLT"}
                        .
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Código */}
                      <div className="grid gap-3">
                        <Label htmlFor="codigoVlt" className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Código do VLT *
                        </Label>
                        <Input
                          id="codigoVlt"
                          placeholder="Ex: VLT-302"
                          value={codigoVlt}
                          onChange={(e) => setCodigoVlt(e.target.value)}
                          disabled={isSubmittingVlt}
                          required
                        />
                      </div>

                      {/* Status */}
                      <div className="grid gap-3">
                        <Label htmlFor="statusVlt" className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Status *
                        </Label>
                        <select
                          id="statusVlt"
                          value={statusVlt}
                          onChange={(e) => setStatusVlt(e.target.value)}
                          disabled={isSubmittingVlt}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="ATIVO">Ativo</option>
                          <option value="INATIVO">Inativo</option>
                          <option value="MANUTENCAO">Manutenção</option>
                        </select>
                      </div>

                      {/* Localização */}
                      <div className="grid gap-3">
                        <Label
                          htmlFor="localizacaoVlt"
                          className="flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4" />
                          Localização
                        </Label>
                        <Input
                          id="localizacaoVlt"
                          placeholder="Ex: Estação Central"
                          value={localizacaoVlt}
                          onChange={(e) => setLocalizacaoVlt(e.target.value)}
                          disabled={isSubmittingVlt}
                        />
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-4">
                      {vltEditando && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetFormVlt}
                          disabled={isSubmittingVlt}
                        >
                          Cancelar Edição
                        </Button>
                      )}
                      <Button type="submit" disabled={isSubmittingVlt}>
                        {vltEditando ? "Salvar Alterações" : "Cadastrar VLT"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                {/* Filtro + contador */}
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Pesquisar VLTs..."
                      value={searchTermVlt}
                      onChange={(e) => setSearchTermVlt(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {vltsFiltrados.length} de {vlts.length} VLTs
                  </div>
                </div>

                {/* Lista de VLTs */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800">VLTs Cadastrados</h2>

                  {vltsFiltrados.length === 0 ? (
                    <div className="text-center py-12">
                      <Train className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">
                        {vlts.length === 0
                          ? "Nenhum VLT cadastrado"
                          : "Nenhum VLT encontrado"}
                      </h3>
                      <p className="mt-2 text-gray-500">
                        {vlts.length === 0
                          ? "Comece cadastrando o primeiro VLT."
                          : "Tente ajustar os termos da pesquisa."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {vltsFiltrados.map((vlt) => (
                        <Card key={vlt.idVlt} className="relative">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                  <Train className="w-5 h-5 text-blue-600" />
                                  {vlt.codigo}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  Status: {vlt.status || "N/A"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Localização: {vlt.localizacao || "N/A"}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditVlt(vlt)}
                                  title="Editar VLT"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteVlt(vlt.idVlt)}
                                  title="Deletar VLT"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">ID VLT:</span>
                                <span className="font-medium">{vlt.idVlt}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* TAB: VIAGENS */}
          <TabsContent value="viagens" className="p-6">
            {viagensLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Carregando viagens...</p>
              </div>
            ) : (
              <>
                <Card className="mb-8">
                  <form onSubmit={handleSubmitViagem}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Route className="w-5 h-5" />
                        {viagemEditando ? "Editar Viagem" : "Cadastrar Nova Viagem"}
                      </CardTitle>
                      <CardDescription>
                        {viagemEditando ? "Atualize os dados da viagem" : "Preencha os dados para adicionar uma nova viagem"}.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="dataHoraViagem" className="flex items-center gap-2">
                          <Route className="w-4 h-4" />
                          Data e Hora *
                        </Label>
                        <Input
                          id="dataHoraViagem"
                          type="datetime-local"
                          value={dataHoraViagem}
                          onChange={(e) => setDataHoraViagem(e.target.value)}
                          disabled={isSubmittingViagem}
                          required
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="statusViagem" className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Status *
                        </Label>
                        <select
                          id="statusViagem"
                          value={statusViagem}
                          onChange={(e) => setStatusViagem(e.target.value)}
                          disabled={isSubmittingViagem}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="AGENDADA">Agendada</option>
                          <option value="EM_PROGRESSO">Em Progresso</option>
                          <option value="CONCLUIDA">Concluída</option>
                          <option value="CANCELADA">Cancelada</option>
                        </select>
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="origemViagem" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Origem *
                        </Label>
                        <Input
                          id="origemViagem"
                          placeholder="Ex: Estação Central"
                          value={origemViagem}
                          onChange={(e) => setOrigemViagem(e.target.value)}
                          disabled={isSubmittingViagem}
                          required
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="destinoViagem" className="flex items-center gap-2">
                          <MapIcon className="w-4 h-4" />
                          Destino *
                        </Label>
                        <Input
                          id="destinoViagem"
                          placeholder="Ex: Estação Terminal"
                          value={destinoViagem}
                          onChange={(e) => setDestinoViagem(e.target.value)}
                          disabled={isSubmittingViagem}
                          required
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="vltViagem" className="flex items-center gap-2">
                          <Train className="w-4 h-4" />
                          VLT *
                        </Label>
                        <select
                          id="vltViagem"
                          value={idVltViagem}
                          onChange={(e) => setIdVltViagem(Number(e.target.value))}
                          disabled={isSubmittingViagem}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Selecione um VLT</option>
                          {vlts.map((vlt) => (
                            <option key={vlt.idVlt} value={vlt.idVlt}>
                              VLT {vlt.codigo} - {vlt.status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="condutorViagem" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Condutor *
                        </Label>
                        <select
                          id="condutorViagem"
                          value={idCondutorViagem}
                          onChange={(e) => setIdCondutorViagem(Number(e.target.value))}
                          disabled={isSubmittingViagem}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Selecione um condutor</option>
                          {condutores.map((condutor) => (
                            <option key={condutor.idCondutor} value={condutor.idCondutor}>
                              {condutor.usuarioNome} - {condutor.matricula}
                            </option>
                          ))}
                        </select>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-4">
                      {viagemEditando && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetFormViagem}
                          disabled={isSubmittingViagem}
                        >
                          Cancelar Edição
                        </Button>
                      )}
                      <Button type="submit" disabled={isSubmittingViagem}>
                        {viagemEditando ? "Salvar Alterações" : "Cadastrar Viagem"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Pesquisar viagens..."
                      value={searchTermViagem}
                      onChange={(e) => setSearchTermViagem(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {viagensFiltrados.length} de {viagens.length} viagens
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800">Viagens Cadastradas</h2>

                  {viagensFiltrados.length === 0 ? (
                    <div className="text-center py-12">
                      <Route className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">
                        {viagens.length === 0 ? "Nenhuma viagem cadastrada" : "Nenhuma viagem encontrada"}
                      </h3>
                      <p className="mt-2 text-gray-500">
                        {viagens.length === 0
                          ? "Comece cadastrando a primeira viagem."
                          : "Tente ajustar os termos da pesquisa."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {viagensFiltrados.map((viagem) => (
                        <Card key={viagem.idViagem} className="relative">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg text-gray-800">
                                    {viagem.origem} → {viagem.destino}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    viagem.status === "CONCLUIDA" ? "bg-green-100 text-green-800" :
                                    viagem.status === "EM_PROGRESSO" ? "bg-blue-100 text-blue-800" :
                                    viagem.status === "CANCELADA" ? "bg-red-100 text-red-800" :
                                    "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {viagem.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-3">
                                  {new Date(viagem.dataHora).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditViagem(viagem)}
                                  title="Editar Viagem"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteViagem(viagem.idViagem)}
                                  title="Deletar Viagem"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">VLT:</span>
                                <p className="font-medium">VLT {viagem.vlt?.numero || "N/A"}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Condutor:</span>
                                <p className="font-medium">{viagem.condutor?.usuarioNome || "N/A"}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Linha:</span>
                                <p className="font-medium">{viagem.vlt?.linha?.nome || "N/A"}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">ID Viagem:</span>
                                <p className="font-medium">{viagem.idViagem}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}