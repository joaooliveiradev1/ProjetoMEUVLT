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


export default function CondutorPage() {
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle>Escala atual</CardTitle>
          <CardDescription>Sua atividade programada para hoje.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">Linha Parangaba-Mucuripe</p>
            <p className="text-sm text-gray-500">Veículo: VLT-04 • Turno: Tarde</p>
          </div>
          <Badge className="bg-blue-600 text-white hover:bg-blue-700">Em operação</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Próximas viagens</CardTitle>
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