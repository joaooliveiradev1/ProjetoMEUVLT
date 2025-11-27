"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus, Edit, Trash2, Search, Bus, MapPin, Route, Train, Bell, Map as MapIcon, AlertTriangle, CheckCircle, XCircle, User, Mail, IdCard, Building } from "lucide-react";
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
  deleteEstacao
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

export default function GerenciamentoSistema() {
  const [activeTab, setActiveTab] = useState<"condutores" | "estacoes" | "vlts" | "viagens" | "alertas" | "linhas">("condutores");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para Condutores
  const [condutores, setCondutores] = useState<CondutorType[]>([]);
  const [condutoresLoading, setCondutoresLoading] = useState(false);
  const [condutorEditando, setCondutorEditando] = useState<CondutorType | null>(null);
  const [isSubmittingCondutor, setIsSubmittingCondutor] = useState(false);
  
  // Formulário de Condutor
  const [matricula, setMatricula] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [usuarioNome, setUsuarioNome] = useState("");
  const [usuarioEmail, setUsuarioEmail] = useState("");

  // Estados para Alertas
  const [alertas, setAlertas] = useState<AlertaType[]>([]);
  const [pendentes, setPendentes] = useState<IncidenteViewType[]>([]);
  const [alertasLoading, setAlertasLoading] = useState(false);

  // Estados para Linhas
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [linhasLoading, setLinhasLoading] = useState(false);
  
  // Estados do formulário de Linhas
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

// Estados para o formulário de Estações
const [estacoesLoading, setEstacoesLoading] = useState(false);
const [estacaoEditando, setEstacaoEditando] = useState<Estacao | null>(null);
const [isSubmittingEstacao, setIsSubmittingEstacao] = useState(false);

    // Formulário de Estação
    const [nomeEstacao, setNomeEstacao] = useState("");
    const [enderecoEstacao, setEnderecoEstacao] = useState("");
    const [idLinhaEstacao, setIdLinhaEstacao] = useState<number | "">("");

  // Carregar dados quando a tab mudar
    useEffect(() => {
    if (activeTab === "alertas") {
        carregarAlertas();
    } else if (activeTab === "linhas" || activeTab === "estacoes") {
        carregarLinhas();
    } else if (activeTab === "condutores") {
        carregarCondutores();
    }
    }, [activeTab]);

  // ========== FUNÇÕES PARA CONDUTORES ==========
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

  // Filtro para condutores
  const condutoresFiltrados = condutores.filter(condutor =>
    condutor.usuarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condutor.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condutor.usuarioEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções para Alertas
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

  //Funções para estações
  async function carregarEstacoes() {
  setEstacoesLoading(true);
  try {
    const estacoesData = await getEstacoes();
    setEstacoes(estacoesData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro ao carregar estações:", error);
    alert("Erro ao carregar estações: " + (error.message || "Verifique a conexão."));
  } finally {
    setEstacoesLoading(false);
  }
}

// Função para resetar o formulário de estação
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
    // Recarrega as linhas e estações
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

// Filtro para estações
const estacoesFiltradas = estacoes.filter(estacao =>
  estacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
  estacao.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
  estacao.linha?.nome.toLowerCase().includes(searchTerm.toLowerCase())
);

  // Funções para Linhas
  async function carregarLinhas() {
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
  }

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

  return (
    <div className="pl-35 justify-center w-350 p-6">
        {/* Header */}
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
                Painel do administrador
            </h1>
            <p className="text-gray-600">
                Gerencie condutores, estações, VLTs, viagens, alertas e linhas
            </p>
        </div>
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b">
          <nav className="flex space-x-8 pl-12 gap-20 px-6">
            {[
              { id: "condutores", label: "Condutores", icon: Bus },
              { id: "estacoes", label: "Estações", icon: MapPin },
              { id: "vlts", label: "VLTs", icon: Train },
              { id: "viagens", label: "Viagens", icon: Route },
              { id: "alertas", label: "Alertas", icon: Bell },
              { id: "linhas", label: "Linhas", icon: MapIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        
        {/* Tab de Condutores */}
        {activeTab === "condutores" && (
          <div className="p-6">
            {condutoresLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Carregando condutores...</p>
              </div>
            ) : (
              <>
                {/* Formulário de Cadastro/Edição de Condutor */}
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

                {/* Search Bar para Condutores */}
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

                {/* Lista de Condutores */}
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
          </div>
        )}

        {/* Tab de Alertas */}
        {activeTab === "alertas" && (
          <div className="p-6">
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
          </div>
        )}

        {/* Tab de Linhas */}
        {activeTab === "linhas" && (
          <div className="p-6">
            {linhasLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Carregando linhas...</p>
              </div>
            ) : (
              <>
                {/* Formulário de Cadastro/Edição */}
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

                {/* Lista de Linhas */}
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
          </div>
        )}

            {activeTab === "estacoes" && (
    <div className="p-6">
        {linhasLoading ? ( // Usando linhasLoading porque carregarLinhas é chamada
        <div className="flex justify-center items-center py-8">
            <p className="text-gray-600">Carregando estações...</p>
        </div>
        ) : (
        <>
            {/* Formulário de Cadastro/Edição de Estação */}
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
                    onChange={(e) => setIdLinhaEstacao(Number(e.target.value))}
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

            {/* Search Bar para Estações */}
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

            {/* Lista de Estações */}
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
    </div>
    )}

        {/* Outras tabs (em desenvolvimento) */}
        {["vlts", "viagens"].includes(activeTab) && (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Funcionalidade em Desenvolvimento
              </h3>
              <p className="text-gray-500">
                O {activeTab === "vlts" ? "gerenciamento de VLTs" : 
                  "gerenciamento de viagens"} estará disponível em breve.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}