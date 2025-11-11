import api from "./api";

export async function getLinhas() {
  const response = await api.get("/api/linhas");
  return response.data;
}

export async function getEstacoes() {
  const response = await api.get("/estacoes");
  return response.data;
}
