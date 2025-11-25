"use client";

import { useEffect, useState } from "react";
import { getUsuarioById, updateUsuario } from "@/services/vltService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Save, User } from "lucide-react";

export default function AdminPerfilPage() {
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  
  // ID fixo para teste (em produção viria do token/contexto)
  const userId = 1; 

  useEffect(() => {
    async function loadProfile() {
      try {
        // Em um cenário real, decodifique o token para pegar o ID
        const data = await getUsuarioById(userId);
        setNome(data.nome);
        setEmail(data.email);
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await updateUsuario(userId, { nome, email });
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar perfil.");
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando perfil...</div>;

  return (
    <main className="container mx-auto px-6 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">{nome}</CardTitle>
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                 <ShieldCheck className="w-3 h-3 mr-1" /> Administrador
               </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="nome" className="pl-8" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email Corporativo</Label>
            <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="pt-4">
             <h3 className="text-sm font-medium text-gray-500 mb-2">Permissões</h3>
             <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Gerenciar todas as linhas e estações</li>
                <li>Gerenciar quadro de condutores</li>
                <li>Visualizar e resolver incidentes</li>
             </ul>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Salvar Alterações
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}