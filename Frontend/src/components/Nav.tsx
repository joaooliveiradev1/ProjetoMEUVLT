"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Nav() {
  // Rotas padrão apontando para as URLs ofuscadas
  const [perfilRoute, setPerfilRoute] = useState("/auth");
  const [linhasRoute, setLinhasRoute] = useState("/secure/v1/dashboard"); 
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      setIsLoggedIn(true);
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        const role = payload.role;
        
        // Mapeamento para rotas ofuscadas
        if (role === "ROLE_Administrador" || role === "Administrador") {
          setPerfilRoute("/secure/v3/account"); // Perfil Admin
          setLinhasRoute("/secure/v3/master");  // Dashboard Admin
        } else if (role === "ROLE_Condutor" || role === "Condutor") {
          setPerfilRoute("/secure/v2/account"); // Perfil Condutor
          setLinhasRoute("/secure/v2/console"); // Operação Condutor
        } else {
          setPerfilRoute("/secure/v1/account");   // Perfil Passageiro
          setLinhasRoute("/secure/v1/dashboard"); // Linhas Passageiro
        }

      } catch (error) {
        console.error("Erro token:", error);
        setPerfilRoute("/auth");
        setLinhasRoute("/secure/v1/dashboard");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setLinhasRoute("/secure/v1/dashboard");
    setPerfilRoute("/auth");
    router.push("/auth");
  };

  return (
    <nav className="flex w-full items-center justify-between bg-white px-6 md:px-16 py-5 shadow-md">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image alt="logo" src="/train.svg" width={40} height={40} className="cursor-pointer"/>
        </Link>
        <h2 className="text-xl font-bold text-gray-800">Meu VLT</h2>
      </div>

      <ul className="hidden md:flex list-none gap-8 text-gray-800 font-medium pr-20">
        <li><Link className="hover:text-blue-600 transition-colors" href={"/"}>Início</Link></li>
        {/* Link dinâmico: Vai para o dashboard correto baseado no login */}
        <li><Link className="hover:text-blue-600 transition-colors" href={isLoggedIn ? linhasRoute : "/secure/v1/dashboard"}>Linhas</Link></li>
        <li><Link className="hover:text-blue-600 transition-colors" href={"/#sobre"}>Sobre</Link></li>
        <li><Link className="hover:text-blue-600 transition-colors" href={"/#contato"}>Contato</Link></li>
      </ul>

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
            <Menu className="h-6 w-6 text-gray-700" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white">
          {isLoggedIn ? (
            <>
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={perfilRoute} className="cursor-pointer flex items-center w-full">
                  <User className="mr-2 h-4 w-4" /> Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={linhasRoute} className="cursor-pointer">
                  Acessar Painel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                Sair
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel>Acesso</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href={"/auth"}>Login</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href={"/auth"}>Registro</Link></DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}