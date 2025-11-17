import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Nav(){

    return(
        <nav className="flex w-full items-center justify-between bg-white px-16 py-5 shadow-md">
            <div className="flex items-center gap-3">
            <Image alt="logo" src="/train.svg" width={40} height={40}/>
            <h2 className="text-xl font-bold text-gray-800">Meu Vlt</h2>
            </div>

            <ul className="flex list-none gap-8 text-gray-800 font-medium pr-20">
                <li>
                    <Link className="transition-colors duration-300 hover:text-blue-600" href={"/#"}>
                    Inicio
                    </Link>
                    </li>
                <li>
                    <Link className="transition-colors duration-300 hover:text-blue-600" href={"passageiro/linhas"}>
                    Linhas
                    </Link>
                    </li>
                <li>
                    <Link className="transition-colors duration-300 hover:text-blue-600" href={"/#"}>
                    Sobre
                    </Link>
                    </li>
                <li>
                    <Link className="transition-colors duration-300 hover:text-blue-600" href={"/#"}>
                    Contato
                    </Link>
                </li>
            </ul>
        
            <DropdownMenu>
            <DropdownMenuTrigger><Menu /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <>
                 <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={"/rotas"}>
                    Rotas
                    </Link>
                </DropdownMenuItem>
                </> 
                <>
                <DropdownMenuLabel >
                    <Link href={"/auth"}>
                    Faça Login
                    </Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <Link href={"/auth"}>
                    Registre-se
                    </Link>
                    </DropdownMenuItem>
                </>
            </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
}