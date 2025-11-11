import api from "./api";

export interface LinhaData { 
  nome: string;
  numero: string;
}

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
