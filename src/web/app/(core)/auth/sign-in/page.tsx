"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OAuthSession
  from "@/app/(core)/auth/components/oauth-session";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    console.log("[v0] Login attempted with:", { email, password })
  }

  const handleOAuthLogin = (provider: string) => {
    console.log("[v0] Social login with:", provider)
  }

  return (
      <>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold font-sans text-card-foreground">Bem vindo!</CardTitle>
          <CardDescription className="text-card-foreground/70 font-sans">
            Entre com sua conta para continuar
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-card-foreground font-sans">
                E-mail
              </Label>
              <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/40 bg-white/10 placeholder:text-card-foreground/50 text-card-foreground py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-card-foreground font-sans">
                Senha
              </Label>
              <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/40 bg-white/10 placeholder:text-card-foreground/50 text-card-foreground py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
                  required
              />
            </div>

            <Button
              type="submit"
              className="w-full ripple-effect hover-lift font-sans font-bold py-5 transition-all duration-300"
              style={{ backgroundColor: "#0C115B", color: "white" }}
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="relative flex justify-center text-sm text-card-foreground/60 font-sans">
              <span>Nao tenho uma conta, <a className='text-blue-400 hover:text-blue-500 cursor-pointer' href='/auth/sign-up'>registrar</a></span>
            </div>
          </form>

          <OAuthSession handleOauthLogin={handleOAuthLogin} />

          <div className="text-center">
            <a
              href="#"
              className="text-sm text-card-foreground/70 hover:text-card-foreground font-sans transition-colors"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </CardContent>
      </>
  )
}
