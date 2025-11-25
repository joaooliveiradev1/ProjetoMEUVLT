"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, AlertTriangle, History, TrainFront } from "lucide-react";
import Link from "next/link";

export default function CondutorPage() {
  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center text-white">
          <TrainFront className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portal do Condutor</h1>
          <p className="text-gray-500">Bem-vindo ao seu turno de trabalho.</p>
        </div>
      </div>

      {/* CARTÃO PRINCIPAL - CORRIGE A NAVEGAÇÃO */}
      <div className="grid gap-6 mb-8">
        <Card className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
          {/* Efeito visual de fundo */}
          <div className="absolute top-0 right-0 p-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl flex items-center gap-2">
              <PlayCircle className="h-6 w-6 text-green-400" />
              Operação de Viagem
            </CardTitle>
            <CardDescription className="text-slate-300 text-base">
              Acesse o painel operacional para iniciar trajetos e reportar ocorrências na via.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 text-lg shadow-lg transition-transform hover:scale-[1.01]">
              <Link href="/condutor/operacao">
                ACESSAR PAINEL AGORA
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="hover:border-blue-300 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-slate-500" /> Minhas Viagens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Consulte o histórico de viagens realizadas hoje.</p>
            <Button variant="outline" className="w-full" disabled>Ver Histórico</Button>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" /> Emergência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600/80 mb-4">Em caso de acidente grave com vítimas, acione o CCO.</p>
            <Button variant="destructive" className="w-full">SOS CCO</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}