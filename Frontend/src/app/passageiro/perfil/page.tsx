"use client";

import { useEffect, useState } from "react";

import { getUsuarioByEmail, updateUsuario } from "@/services/vltService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Save } from "lucide-react";

export default function PassageiroPerfilPage() {
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
        
          window.location.href = "/auth";
          return;
        }

       
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = JSON.parse(
          decodeURIComponent(
            window.atob(base64)
              .split('')
              .map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
          )
        );
        
        const userEmail = jsonPayload.sub; 

        const data = await getUsuarioByEmail(userEmail);
        
        setUserId(data.idUsuario);
        setNome(data.nome);
        setEmail(data.email);

      } catch (error) {
        console.error("Erro ao carregar perfil do passageiro:", error);
        alert("Erro ao carregar seus dados. Tente fazer login novamente.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
      if (!userId) {
        alert("Erro: Usuário não identificado.");
        return;
      }

      try {
        await updateUsuario(userId, { nome, email });
        alert("Seus dados foram atualizados com sucesso!");
      } catch(e) { 
        console.error(e);
        alert("Erro ao atualizar dados. Tente novamente."); 
      }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Carregando suas informações...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-500">Gerencie suas informações pessoais e de acesso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
       
        <Card className="md:col-span-1 h-fit shadow-sm">
            <CardContent className="flex flex-col items-center pt-6">
                <Avatar className="h-24 w-24 mb-4 ring-2 ring-slate-100">
                    <AvatarFallback className="text-2xl bg-black text-white font-bold">
                        {nome ? nome.substring(0,2).toUpperCase() : "US"}
                    </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-center text-gray-800">{nome}</h2>
                <p className="text-sm text-gray-500 mb-4">{email}</p>
                <Badge variant="outline" className="bg-black text-white border-white">
                  Passageiro
                </Badge>
            </CardContent>
        </Card>

        
        <Card className="md:col-span-2 shadow-sm">
            <CardHeader>
                <CardTitle>Dados da Conta</CardTitle>
                <CardDescription>Atualize seu nome ou endereço de email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                            id="nome" 
                            className="pl-10" 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Endereço de Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                            id="email" 
                            type="email" 
                            className="pl-10" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-6 bg-gray-50/50 rounded-b-xl">
                <p className="text-xs text-gray-400">
                  ID do Usuário: <span className="font-mono text-gray-600">{userId}</span>
                </p>
                <Button onClick={handleSave} className="bg-black hover:bg-black">
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </Button>
            </CardFooter>
        </Card>

      </div>
    </div>
  );
}