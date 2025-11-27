"use client"

import { useState, FormEvent } from "react"
// ... (seus imports permanecem iguais) ...
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/services/api"
import { TrainFront } from "lucide-react"

export default function AuthPage() {
  // ... (estados permanecem iguais) ...
  const [loginEmail, setLoginEmail] = useState("")
  const [loginSenha, setLoginSenha] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regName, setRegName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post("/auth/login", {
        email: loginEmail,
        senha: loginSenha,
      })
      
      const token = response.data.token;
      if (!token) throw new Error("Token não recebido.");

      localStorage.setItem("token", token);

      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        const role = payload.role;
        
        // --- REDIRECIONAMENTO CRIPTOGRAFADO ---
        if (role === "ROLE_Administrador" || role === "Administrador") {
          window.location.href = "/secure/v3/master"; // URL Admin
        } else if (role === "ROLE_Condutor" || role === "Condutor") {
          window.location.href = "/secure/v2/console"; // URL Condutor
        } else {
          window.location.href = "/secure/v1/dashboard"; // URL Passageiro
        }
        // -------------------------------------

      } catch (decodeError) {
        console.error("Erro token", decodeError);
        window.location.href = "/"; 
      }

    } catch (error: any) {
      console.error("Erro no login:", error)
      const msg = error.response?.data?.error || "Erro ao fazer login.";
      alert(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // ... (o resto do componente handleRegister e o return permanecem iguais ao que você já tem) ...
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post("/auth/register", { nome: regName, email: regEmail, senha: regPassword })
      alert("Usuário registrado com sucesso! Faça login agora.")
      setRegEmail(""); setRegPassword(""); setRegName("");
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao registrar usuário.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // ... (seu JSX do return permanece exatamente igual) ...
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-slate-50 p-4">
      {/* ... conteúdo visual ... */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black -600 text-white mb-4">
          <TrainFront className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao Meu VLT</h1>
        <p className="text-sm text-gray-500 mt-2">Gerencie suas viagens e alertas em um só lugar</p>
      </div>

      <Tabs className="w-full max-w-md" defaultValue="account">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-6 bg-white border shadow-sm">
          <TabsTrigger value="account">Login</TabsTrigger>
          <TabsTrigger value="password">Registro</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="border-0 shadow-xl ring-1 ring-slate-900/5">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center">Acessar conta</CardTitle>
              <CardDescription className="text-center">Entre com seu email e senha</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <form className="grid gap-4" onSubmit={handleLogin}>
                <div className="grid gap-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="ex: joao@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="h-10" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input id="login-password" type="password" placeholder="••••••••" value={loginSenha} onChange={(e) => setLoginSenha(e.target.value)} required className="h-10" />
                </div>
                <Button type="submit" className="w-full h-10 mt-2 text-base" disabled={isLoading}>{isLoading ? "Entrando..." : "Entrar"}</Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center pb-6"><p className="text-xs text-gray-500">Esqueceu a senha? Contate o suporte.</p></CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className="border-0 shadow-xl ring-1 ring-slate-900/5">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center">Criar nova conta</CardTitle>
              <CardDescription className="text-center">Preencha os dados abaixo para começar</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleRegister}>
                <div className="grid gap-2"><Label htmlFor="reg-name">Nome Completo</Label><Input id="reg-name" placeholder="Seu nome" value={regName} onChange={(e) => setRegName(e.target.value)} required className="h-10" /></div>
                <div className="grid gap-2"><Label htmlFor="reg-email">Email</Label><Input id="reg-email" type="email" placeholder="seu@email.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="h-10" /></div>
                <div className="grid gap-2"><Label htmlFor="reg-password">Senha</Label><Input id="reg-password" type="password" placeholder="Crie uma senha segura" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required className="h-10" /></div>
                <Button type="submit" className="w-full h-10 mt-2 text-base" disabled={isLoading}>{isLoading ? "Criando conta..." : "Criar Conta"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}