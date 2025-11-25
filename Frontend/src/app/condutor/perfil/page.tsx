"use client";

import { useEffect, useState } from "react";
import { getUsuarioById, getCondutorById, updateUsuario } from "@/services/vltService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrainFront, Save, Award, MapPin } from "lucide-react";

export default function CondutorPerfilPage() {
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  
  
  const userId = 2; 
  const condutorId = 1; 

  useEffect(() => {
    async function loadProfile() {
      try {
       
        const [userData, condutorData] = await Promise.all([
             getUsuarioById(userId),
             getCondutorById(condutorId)
        ]);
        
        setNome(userData.nome);
        setEmail(userData.email);
        setMatricula(condutorData.matricula);
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
        alert("Dados atualizados!");
      } catch(e) { alert("Erro ao atualizar"); }
  };

  if (loading) return <div className="p-8 text-center">Carregando Perfil...</div>;

  return (
    <main className="container mx-auto px-6 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Perfil Condutor</h1>

      <div className="grid gap-6">
       
        <Card className="border-l-4 border-l-black -600">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="h-16 w-16 bg-black -200 text-black -600">
                <AvatarFallback className="text-xl font-bold">CN</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-xl">{nome}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-black -600">Condutor Oficial</Badge>
                    <span className="text-sm text-gray-500">Matrícula: {matricula}</span>
                </div>
            </div>
            </CardHeader>
        </Card>

        
        <Card>
            <CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label>Nome Completo</Label>
                    <Input value={nome} onChange={e => setNome(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label>Email de Contato</Label>
                    <Input value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label>Matrícula (Somente Leitura)</Label>
                    <Input value={matricula} disabled className="bg-slate-100" />
                </div>
            </CardContent>
            <CardFooter className="justify-end">
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/> Salvar</Button>
            </CardFooter>
        </Card>

        
        <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-6">
                    <Award className="h-8 w-8 text-yellow-500 mb-2" />
                    <span className="text-2xl font-bold">4.8</span>
                    <span className="text-xs text-gray-500">Média de Avaliação</span>
                </CardContent>
            </Card>
            <Card className="bg-slate-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-6">
                    <TrainFront className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-2xl font-bold">124</span>
                    <span className="text-xs text-gray-500">Viagens Realizadas</span>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}