"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  getLinhas,
  getEstacoes,
  createLinha,
  updateLinha,
  deleteLinha,
} from "@/services/vltService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react"; 



interface Linha {
  idLinha: number;
  nome: string;
  numero: string;
  
}

interface Estacao {
  idEstacao: number;
  nome: string;
  endereco: string; 
  linha: Linha; 
}

export default function LinhasPage() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);

  
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  async function fetchData() {
    try {
      const [linhasData, estacoesData] = await Promise.all([
        getLinhas(),
        getEstacoes(),
      ]);
      setLinhas(linhasData);
      setEstacoes(estacoesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados. Verifique se o servidor está no Ar!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  

  const resetForm = () => {
    setNome("");
    setNumero("");
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar linha:", error);
      alert("Erro ao salvar linha. Você precisa estar logado como Administrador.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (linha: Linha) => {
    setEditingId(linha.idLinha);
    setNome(linha.nome);
    setNumero(linha.numero);
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  const handleDeleteClick = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar esta linha?")) {
      return;
    }

    try {
      await deleteLinha(id);
      alert("Linha deletada com sucesso!");
      fetchData(); 
    } catch (error) {
      console.error("Erro ao deletar linha:", error);
      alert("Erro ao deletar linha. Você precisa estar logado como Administrador.");
    }
  };

  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 text-lg">Carregando linhas e estações...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
        Gerenciar Linhas e Estações
      </h1>

     
      <Card className="mb-12 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
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
              <Label htmlFor="numero">Número/Código</Label>
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

      
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Linhas Cadastradas
      </h2>

      {linhas.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma linha cadastrada.</p>
      ) : (
        <div className="space-y-10">
          {linhas.map((linha) => {
            
            const estacoesDaLinha = estacoes.filter(
              (e) => e.linha?.idLinha === linha.idLinha
            );

            return (
              <div
                key={linha.idLinha} 
                className="bg-white border rounded-2xl shadow-md transition p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-blue-600">
                      {linha.nome}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      (Cód: {linha.numero || "N/A"})
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(linha)}
                      title="Editar Linha"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(linha.idLinha)}
                      title="Deletar Linha"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {estacoesDaLinha.length > 0 ? (
                  <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {estacoesDaLinha.map((estacao) => (
                      <li
                        key={estacao.idEstacao} 
                        className="bg-gray-50 border rounded-xl p-4 text-center shadow-sm"
                      >
                        <p className="font-medium text-gray-800">
                          {estacao.nome}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {estacao.endereco || "Endereço não informado"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    Nenhuma estação cadastrada nesta linha.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}