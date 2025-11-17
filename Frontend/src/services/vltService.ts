import api from "./api";

export interface LinhaData { 
  nome: string;
  numero: string;
}

// Funções que você já tinha
export async function getLinhas() {
  const response = await api.get("/api/linhas");
  return response.data;
}

export async function getEstacoes() {
  const response = await api.get("/estacoes");
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


// --- NOVAS FUNÇÕES PARA O FLUXO DE ALERTA ---

// Para o Condutor enviar o incidente
export async function createIncidente(data: any) {
  // O backend espera um POST para /incidente
  //
  const response = await api.post("/incidente", data);
  return response.data;
}

// Para o Passageiro receber os alertas
export async function getAlertas() {
  // O backend expõe os alertas em GET /alertas
  //
  const response = await api.get("/alertas");
  return response.data;
}