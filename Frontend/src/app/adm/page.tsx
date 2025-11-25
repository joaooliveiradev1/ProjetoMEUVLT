"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Bus, User, FileText, Settings, Megaphone } from "lucide-react";
import Link from "next/link"; // Importante para navegação SPA

export default function AdmPage() {
  return (
    <div className="space-y-6 container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Monitoramento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Sistema Online</div>
            <p className="text-xs text-red-500 mt-1">Verifique alertas pendentes.</p>
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
        <CardContent className="grid gap-4 md:grid-cols-3">
          
          {/* BOTÃO DE ALERTAS */}
          <Button variant="outline" asChild className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 border-dashed cursor-pointer">
            <Link href="/adm/alertas">
                <Megaphone className="h-6 w-6 mb-1 text-blue-600" />
                Gerenciar Alertas
            </Link>
          </Button>

          <Button variant="outline" asChild className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 border-dashed cursor-pointer">
            <Link href="/adm/linhas">
                <Bus className="h-6 w-6 mb-1 text-gray-600" />
                Gerenciar Linhas
            </Link>
          </Button>

          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 border-dashed" disabled>
            <User className="h-6 w-6 mb-1 text-gray-400" />
            Usuários (Em breve)
          </Button>
          
        </CardContent>
      </Card>
    </div>
  );
}