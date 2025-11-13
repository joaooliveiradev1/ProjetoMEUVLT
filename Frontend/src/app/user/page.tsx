"use client";

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
    </div>
  );
}
