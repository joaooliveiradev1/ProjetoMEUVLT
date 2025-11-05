"use client"
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
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function AuthPage(){
return(
<>
    <div className="flex-1  bg-amber-800 flex items-center justify-center p-4 bg-cyan-900">
      <Tabs className="w-full max-w-md pb-35" defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Login</TabsTrigger>
              <TabsTrigger value="password">Registro</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Faça login</CardTitle>
                  <CardDescription>
                    Acesse sua conta para ter acesso a plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-name">Email</Label>
                    <Input id="tabs-demo-name" defaultValue="seuemailexeplo@gmail.com" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-username">Senha</Label>
                    <Input id="tabs-demo-username" defaultValue="Insira sua" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you&apos;ll be logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-current">Current password</Label>
                    <Input id="tabs-demo-current" type="password" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-new">New password</Label>
                    <Input id="tabs-demo-new" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
    </div>
    
        <Footer ></Footer>
</>
);
}