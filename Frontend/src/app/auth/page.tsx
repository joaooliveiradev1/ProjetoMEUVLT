"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Footer from "@/components/Footer"
import Nav from "@/components/Nav"
import api from "@/services/api"

export default function AuthPage() {

  const [loginEmail, setLoginEmail] = useState("")
  const [loginSenha, setLoginSenha] = useState("")

  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regName, setRegName] = useState("")

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await api.post("/auth/login", {
      email: loginEmail,
      senha: loginSenha,
    })
      console.log("Login bem-sucedido:", response.data)

      localStorage.setItem("token", response.data.token)

      alert("Login realizado com sucesso!")
    } catch (error: unknown) {
      console.error("Erro no login:", error)
      alert("Erro ao fazer login")
    }
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await api.post("/auth/register", {
        nome: regName,
        email: regEmail,
        senha: regPassword,
      })

      console.log("Registro realizado:", response.data)

      alert("Usuário registrado com sucesso!")
    } catch (error: unknown) {
      console.error("Erro no registro:", error)
      alert("Erro ao registrar usuário")
    }
  }

  return (
    <>
      <div className="flex-1 flex items-center bg-slate-200 justify-center p-4 ">
        <Tabs className="w-full pt-15 max-w-md pb-35" defaultValue="account">

          <TabsList>
            <TabsTrigger value="account">Login</TabsTrigger>
            <TabsTrigger value="password">Registro</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Faça login</CardTitle>
                <CardDescription>
                  Acesse sua conta para ter acesso à plataforma.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-6">
                <form className="grid gap-6" onSubmit={handleLogin}>
                  <div className="grid gap-3">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seuemailexemplo@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Insira sua senha"
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
                    />
                  </div>

                  <CardFooter className="px-0">
                    <Button type="submit" className="w-full">
                      Entrar
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Registro</CardTitle>
                <CardDescription>
                  Crie sua conta para acessar o sistema.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form className="grid gap-6" onSubmit={handleRegister}>
                  <div className="grid gap-3">
                    <Label htmlFor="reg-name">Nome</Label>
                    <Input
                      id="reg-name"
                      placeholder="Seu nome completo"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="seuemailexemplo@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="reg-password">Senha</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Crie uma senha"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </div>

                  <CardFooter className="px-0">
                    <Button type="submit" className="w-full">
                      Registrar
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </>
  )
}
