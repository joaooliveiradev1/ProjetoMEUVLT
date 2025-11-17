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


import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import Link from "next/link";

export default function userPage() {
  return (
    <div className="w-64 bg-white border-r h-full flex flex-col p-4">

      <nav className="flex flex-col gap-3 pl-12">
        <Link href="/user" className="hover:text-blue-600">
          Home
        </Link>

        <Link href="/viagens" className="hover:text-blue-600">
          Minhas Viagens
        </Link>

        <Link href="/incidentes" className="hover:text-blue-600">
          Incidentes
        </Link>

        <Link href="/alertas" className="hover:text-blue-600">
          Alertas
        </Link>

        <Link href="/perfil" className="hover:text-blue-600">
          Perfil
        </Link>
      </nav>

      <div>
         <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" /> Últimas viagens
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



    </div>
    </div>
  );
}
