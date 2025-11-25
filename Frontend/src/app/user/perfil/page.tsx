"use client";

import { useEffect, useState } from "react";
import { getUsuarioById, updateUsuario } from "@/services/vltService";
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

  // ID fixo para teste
  const userId = 3; 

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUsuarioById(userId);
        setNome(data.nome);
        setEmail(data.email);
      } catch (error) {
        console.error("Erro", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
      try {
        await updateUsuario(userId, { nome, email });
        alert("Seus dados foram atualizados.");
      } catch(e) { alert("Erro ao atualizar."); }
  };

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-500">Gerencie suas informações pessoais e preferências.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Coluna da Esquerda: Resumo */}
        <Card className="md:col-span-1 h-fit">
            <CardContent className="flex flex-col items-center pt-6">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-2xl bg-slate-200">
                        {nome.substring(0,2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-center">{nome}</h2>
                <p className="text-sm text-gray-500 mb-4">{email}</p>
                <Badge variant="outline">Passageiro</Badge>
            </CardContent>
        </Card>

        {/* Coluna da Direita: Formulário */}
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>Faça alterações nos seus dados de cadastro aqui.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <div className="relative">
                        <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                            id="nome" 
                            className="pl-8" 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Endereço de Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                            id="email" 
                            type="email" 
                            className="pl-8" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-6">
                <p className="text-xs text-gray-400">Última atualização: Hoje</p>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </Button>
            </CardFooter>
        </Card>

      </div>
    </div>
  );
}