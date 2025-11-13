"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  ShieldCheck, 
  Bus, 
  MapPin, 
  User, 
  Settings, 
  Bell, 
  FileText,
  AlertTriangle,
  History
} from "lucide-react";

// --- Tipos para o Prototipo ---
type UserRole = "admin" | "condutor" | "passageiro";

interface UserProfile {
  nome: string;
  email: string;
  tipo: UserRole;
  matricula?: string; // Apenas para funcionários
}

export default function ProfilePage() {
  // MOCK STATE: Estado simulado localmente para prototipagem
  // Por padrão começa como 'passageiro', mas você pode mudar com os botões de teste
  const [user, setUser] = useState<UserProfile>({
    nome: "Carlos Eduardo",
    email: "carlos.edu@email.com",
    tipo: "passageiro"
  });

  // Função para simular a troca de usuario (APENAS PARA TESTE VISUAL)
  const simularTrocaDePapel = (novoTipo: UserRole) => {
    const novosDados = {
      admin: { nome: "Ana Beatriz", email: "ana.admin@meuvlt.com", matricula: "ADM-001" },
      condutor: { nome: "Roberto Silva", email: "roberto.cond@meuvlt.com", matricula: "MOT-992" },
      passageiro: { nome: "Carlos Eduardo", email: "carlos.edu@email.com", matricula: undefined }
    };
    
    setUser({
      ...novosDados[novoTipo],
      tipo: novoTipo
    });
  };

  return (
    <main className="container mx-auto px-6 py-12 max-w-5xl">
      
      {/* --- AREA DE DESENVOLVIMENTO (Remover ao integrar com backend) --- */}
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-sm text-yellow-800 font-medium mb-2">🚧 Modo Protótipo: Escolha um perfil para visualizar</p>
        <div className="flex justify-center gap-2">
          <Button size="sm" variant={user.tipo === 'admin' ? 'default' : 'outline'} onClick={() => simularTrocaDePapel('admin')}>Admin</Button>
          <Button size="sm" variant={user.tipo === 'condutor' ? 'default' : 'outline'} onClick={() => simularTrocaDePapel('condutor')}>Condutor</Button>
          <Button size="sm" variant={user.tipo === 'passageiro' ? 'default' : 'outline'} onClick={() => simularTrocaDePapel('passageiro')}>Passageiro</Button>
        </div>
      </div>
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-500">Gerencie suas informações e visualize dados da sua conta.</p>
        </div>
        <Button variant="destructive" className="gap-2">
          <LogOut className="h-4 w-4" /> Sair da Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA DA ESQUERDA: Card de Identidade (Comum a todos) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-slate-500 to-slate-800"></div>
            <CardHeader className="relative pt-0 pb-2">
              <div className="flex justify-center -mt-12 mb-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src="" /> {/* Adicione URL se tiver */}
                  <AvatarFallback className="text-2xl bg-slate-200 text-slate-600">
                    {user.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center">
                <CardTitle className="text-xl">{user.nome}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                {user.matricula && (
                  <p className="text-xs text-gray-400 mt-1 font-mono">Matrícula: {user.matricula}</p>
                )}
                <div className="mt-3 flex justify-center">
                  <RoleBadge role={user.tipo} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                <Settings className="h-4 w-4" /> Editar Dados
              </Button>
            </CardContent>
          </Card>

          {/* Menu Rápido Lateral */}
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start w-full text-left font-normal">
                  <User className="mr-2 h-4 w-4" /> Dados Pessoais
                </Button>
                <Button variant="ghost" className="justify-start w-full text-left font-normal">
                  <Bell className="mr-2 h-4 w-4" /> Notificações
                </Button>
                <Button variant="ghost" className="justify-start w-full text-left font-normal">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Segurança e Senha
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DA DIREITA: Dashboard Dinâmico */}
        <div className="lg:col-span-2">
          {user.tipo === "admin" && <AdminDashboard />}
          {user.tipo === "condutor" && <CondutorDashboard />}
          {user.tipo === "passageiro" && <PassageiroDashboard />}
        </div>
      </div>
    </main>
  );
}

// --- Componentes Visuais Auxiliares ---

function RoleBadge({ role }: { role: UserRole }) {
  const configs = {
    admin: { label: "Administrador", className: "bg-red-100 text-red-700 hover:bg-red-200" },
    condutor: { label: "Condutor", className: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    passageiro: { label: "Passageiro", className: "bg-green-100 text-green-700 hover:bg-green-200" },
  };

  return (
    <Badge className={`${configs[role].className} px-3 py-1 text-sm font-medium border-none shadow-none`}>
      {configs[role].label}
    </Badge>
  );
}

// --- DASHBOARDS ESPECÍFICOS (MOCK) ---

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12.345</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              +18% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-slate-500 mt-1">Requerem atenção imediata</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Painel Administrativo
          </CardTitle>
          <CardDescription>Acesso rápido às ferramentas de gestão.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 border-dashed">
            <Bus className="h-6 w-6 mb-1" />
            Gerenciar Linhas
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 border-dashed">
            <User className="h-6 w-6 mb-1" />
            Gerenciar Usuários
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 border-dashed">
            <FileText className="h-6 w-6 mb-1" />
            Relatórios
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 border-dashed">
            <Settings className="h-6 w-6 mb-1" />
            Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CondutorDashboard() {
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle>Escala Atual</CardTitle>
          <CardDescription>Sua atividade programada para hoje.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">Linha Parangaba-Mucuripe</p>
            <p className="text-sm text-gray-500">Veículo: VLT-04 • Turno: Tarde</p>
          </div>
          <Badge className="bg-blue-600 text-white hover:bg-blue-700">Em Operação</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Próximas Viagens</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm pb-2 border-b last:border-0">
                <span>14:00 - Parangaba</span>
                <span className="font-mono text-gray-500">IDA</span>
              </li>
              <li className="flex justify-between text-sm pb-2 border-b last:border-0">
                <span>14:45 - Iate</span>
                <span className="font-mono text-gray-500">VOLTA</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>15:30 - Parangaba</span>
                <span className="font-mono text-gray-500">IDA</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="destructive" className="w-full justify-start gap-2">
              <AlertTriangle className="h-4 w-4" /> Reportar Incidente
            </Button>
            <Button variant="secondary" className="w-full justify-start gap-2">
              <History className="h-4 w-4" /> Histórico de Viagens
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PassageiroDashboard() {
  return (
    <div className="space-y-6">
      {/* Cartão de Créditos / Passe */}
      <Card className="bg-gradient-to-r from-teal-500 to-teal-700 text-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-teal-100">Meu Saldo (VLT Pass)</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-end">
          <div>
            <span className="text-4xl font-bold">R$ 15,50</span>
            <p className="text-sm text-teal-100 mt-1">Última recarga: 10/10/2023</p>
          </div>
          <Button variant="secondary" size="sm" className="text-teal-800 font-semibold">
            Recarregar
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" /> Rotas Favoritas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Bus className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Casa → Trabalho</p>
                  <p className="text-xs text-gray-500">Parangaba • Mucuripe</p>
                </div>
              </div>
              <Badge variant="outline">25 min</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Bus className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Faculdade</p>
                  <p className="text-xs text-gray-500">Borges de Melo • Benfica</p>
                </div>
              </div>
              <Badge variant="outline">15 min</Badge>
            </div>

            <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-800">
              + Adicionar nova rota
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}