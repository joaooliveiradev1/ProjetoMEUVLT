import api from "./api";

export interface CriarVltData {
  numero: string;
  capacidade: number;
  idLinha: number;
}

export interface Vlt {
  idVlt: number;
  codigo: string;
  status: string | null;
  localizacao: string | null;
}

export interface Alerta {
  idAlerta: number;
  titulo: string;
  mensagem: string;
  dataHoraEnvio: string;
  administradorNome?: string;
  incidenteDescricao?: string;
}

export interface CriarEstacaoData {
  nome: string;
  endereco: string;
  idLinha: number;
}

export interface CriarCondutorData {
  matricula: string;
  usuarioId: number;
}

export interface IncidenteView {
  idIncidente: number;
  descricao: string;
  dataHora: string;
  status: string;
  condutorNome?: string;
  viagemId?: number;
}

export interface CriarAlertaData {
  titulo: string;
  mensagem: string;
  administradorId: number;
}

export interface LinhaData {
  nome: string;
  numero: string;
}

export interface Condutor {
  idCondutor: number;
  matricula: string;
  usuarioId: number;
  usuarioNome: string;
  usuarioEmail: string;
}



export interface Viagem {
  idViagem: number;
  dataHoraInicio: string;
  dataHoraFim: string; 
  idVlt: number;
  idCondutor: number;
  idLinha: number;
  condutorNome?: string;
  vltCodigo?: string;
  linhaNome?: string;
  status: string; 
}

export interface CriarViagemData {
  dataHoraInicio?: string;
  dataHoraFim?: string;
  idVlt?: number;
  idCondutor?: number;
  idLinha?: number;
  status?: string;
}

export interface AtualizarViagemData {
  dataHora?: string;
  origem?: string;
  destino?: string;
  idVlt?: number;
  idCondutor?: number;
  status?: string;
}


// ALERTAS - CRUD

export async function getAlertas(): Promise<Alerta[]> {
  try {
    const response = await api.get("/alertas");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar alertas:", error);
    return [];
  }
}

export async function createAlerta(data: CriarAlertaData) {
  const response = await api.post("/alertas", data);
  return response.data;
}

export async function deleteAlerta(id: number) {
  const response = await api.delete(`/alertas/${id}`);
  return response.data;
}
 
// INCIDENTES - FLUXO DE APROVAÇÃO

export async function getIncidentesPendentes(): Promise<IncidenteView[]> {
  try {
    const response = await api.get("/incidente/status/PENDENTE");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar incidentes pendentes", error);
    return [];
  }
}

export async function atualizarStatusIncidente(
  id: number,
  status: "PUBLICADO" | "REJEITADO"
) {
  const response = await api.put(`/incidente/${id}/status/${status}`);
  return response.data;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createIncidente(data: any) {
  const response = await api.post("/incidente", data);
  return response.data;
}


// LINHAS - CRUD

export async function getLinhas() {
  const response = await api.get("/api/linhas");
  return response.data;
}

export async function createLinha(data: LinhaData) {
  const response = await api.post("/api/linhas", data);
  return response.data;
}

export async function updateLinha(id: number, data: LinhaData) {
  const response = await api.put(`/api/linhas/${id}`, data);
  return response.data;
}

export async function deleteLinha(id: number) {
  const response = await api.delete(`/api/linhas/${id}`);
  return response.data;
}


// ESTAÇÕES - CRUD

export async function getEstacoes() {
  const response = await api.get("/estacoes");
  return response.data;
}

export async function createEstacao(data: CriarEstacaoData) {
  const response = await api.post("/estacoes", data);
  return response.data;
}

export async function updateEstacao(id: number, data: CriarEstacaoData) {
  const response = await api.put(`/estacoes/${id}`, data);
  return response.data;
}

export async function deleteEstacao(id: number) {
  const response = await api.delete(`/estacoes/${id}`);
  return response.data;
}

// USUÁRIOS - CRUD

export async function getUsuarioById(id: number) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUsuario(id: number, data: any) {
  const response = await api.put(`/usuarios/${id}`, data);
  return response.data;
}


// CONDUTORES - CRUD

export async function getCondutores(): Promise<Condutor[]> {
  try {
    const response = await api.get("/condutor");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar condutores:", error);
    return [];
  }
}

export async function getCondutorById(id: number) {
  const response = await api.get(`/condutor/${id}`);
  return response.data;
}

export async function getAllCondutores(): Promise<Condutor[]> {
  try {
    const response = await api.get("/condutor");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar condutores", error);
    return [];
  }
}

export async function createCondutor(data: CriarCondutorData) {
  const response = await api.post("/condutor", data);
  return response.data;
}

export async function updateCondutor(id: number, data: CriarCondutorData) {
  const response = await api.put(`/condutor/${id}`, data);
  return response.data;
}

export async function deleteCondutor(id: number) {
  const response = await api.delete(`/condutor/${id}`);
  return response.data;
}


// VLTs - CRUD

export async function getVlts(): Promise<Vlt[]> {
  const response = await api.get("/vlt");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getVltById(id: number) {
  const response = await api.get(`/vlt/${id}`);
  return response.data;
}

export async function createVlt(data: { codigo: string; status: string; localizacao: string }) {
  const response = await api.post("/vlt", data);
  return response.data;
}

export async function updateVlt(
  id: number,
  data: { codigo: string; status: string; localizacao: string }
) {
  const response = await api.put(`/vlt/${id}`, data);
  return response.data;
}

export async function deleteVlt(id: number) {
  const response = await api.delete(`/vlt/${id}`);
  return response.data;
}



// VIAGENS - CRUD E OPERAÇÕES

export async function getViagens(): Promise<Viagem[]> {
  const response = await api.get("/viagem");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getViagemById(idViagem: number): Promise<Viagem> {
  try {
    const response = await api.get(`/viagem/${idViagem}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar viagem ${idViagem}:`, error);
    throw error;
  }
}

export async function createViagem(data: CriarViagemData): Promise<Viagem> {
  const response = await api.post("/viagem", data);
  return response.data;
}

export async function updateViagem(
  idViagem: number,
  data: CriarViagemData
): Promise<Viagem> {
  const response = await api.put(`/viagem/${idViagem}`, data);
  return response.data;
}

export async function deleteViagem(idViagem: number): Promise<void> {
  try {
    if (!idViagem) {
      throw new Error("ID da viagem é obrigatório");
    }

    await api.delete(`/viagem/${idViagem}`);
  } catch (error) {
    console.error(`Erro ao deletar viagem ${idViagem}:`, error);
    throw error;
  }
}

export async function getViagensPorStatus(status: string): Promise<Viagem[]> {
  try {
    const response = await api.get(`/viagem?status=${status}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Erro ao buscar viagens com status ${status}:`, error);
    return [];
  }
}

export async function getViagensDoCondutor(idCondutor: number): Promise<Viagem[]> {
  try {
    const response = await api.get(`/viagem?idCondutor=${idCondutor}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Erro ao buscar viagens do condutor ${idCondutor}:`, error);
    return [];
  }
}

export async function getViagensDoVlt(idVlt: number): Promise<Viagem[]> {
  try {
    const response = await api.get(`/viagem?idVlt=${idVlt}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Erro ao buscar viagens do VLT ${idVlt}:`, error);
    return [];
  }
}

export async function atualizarStatusViagem(
  idViagem: number,
  novoStatus: string
): Promise<Viagem> {
  try {
    return await updateViagem(idViagem, { status: novoStatus });
  } catch (error) {
    console.error(`Erro ao atualizar status da viagem ${idViagem}:`, error);
    throw error;
  }
}

export async function getUsuarioByEmail(email: string) {
  const response = await api.get(`usuarios/email/${email}`);
  return response.data;
}

export async function getCondutorByEmail(email: string) {
  const response = await api.get(`/condutor/email/${email}`);
  return response.data;
}