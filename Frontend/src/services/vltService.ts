import api from "./api";

// --- INTERFACES ---

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

// Adicionando interface completa para Condutor
export interface Condutor {
  idCondutor: number;
  matricula: string;
  usuarioId: number;
  usuarioNome: string;
  usuarioEmail: string; // Essencial para a comparação
}

// --- 1. ALERTAS (ADMIN & PASSAGEIRO) ---

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

// --- 2. INCIDENTES (FLUXO DE APROVAÇÃO) ---

export async function getIncidentesPendentes(): Promise<IncidenteView[]> {
  try {
    const response = await api.get("/incidente/status/PENDENTE");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar incidentes pendentes", error);
    return [];
  }
}

export async function atualizarStatusIncidente(id: number, status: "PUBLICADO" | "REJEITADO") {
  const response = await api.put(`/incidente/${id}/status/${status}`);
  return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createIncidente(data: any) {
  const response = await api.post("/incidente", data);
  return response.data;
}

// --- 3. LINHAS (CRUD) ---

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

// --- 4. ESTAÇÕES ---
// --- 4. ESTAÇÕES ---

export async function getEstacoes() {
  const response = await api.get("/estacoes");
export async function getEstacoes() {
  const response = await api.get("/estacoes");
  return response.data;
}

// --- 5. USUÁRIOS E CONDUTORES ---
// --- 5. USUÁRIOS E CONDUTORES ---

export async function getUsuarioById(id: number) {
  const response = await api.get(`/usuarios/${id}`);
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUsuario(id: number, data: any) {
  const response = await api.put(`/usuarios/${id}`, data);
  return response.data;
}

export async function getCondutorById(id: number) {
    const response = await api.get(`/condutor/${id}`);
    return response.data;
}

// Nova função para pegar todos e filtrar no front
export async function getAllCondutores(): Promise<Condutor[]> {
    try {
        const response = await api.get("/condutor");
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Erro ao buscar condutores", error);
        return [];
    }
}



export async function getCondutores(): Promise<Condutor[]> {
  try {
    const response = await api.get("/condutor");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar condutores:", error);
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