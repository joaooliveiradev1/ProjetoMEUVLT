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


export default function AdmPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
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