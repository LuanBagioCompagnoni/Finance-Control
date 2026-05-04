"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OAuthSession from "@/app/(core)/auth/components/oauth-session"
import { authApi, ApiError } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setIsLoading(true)
    try {
      await authApi.register({ name, email, password })
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Este e-mail já está cadastrado.")
      } else if (err instanceof ApiError && err.status === 400) {
        setError("Dados inválidos. Verifique os campos e tente novamente.")
      } else {
        setError("Erro ao conectar ao servidor. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: string) => {
    console.log("[v0] Social login with:", provider)
  }

  return (
    <>
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold font-sans text-card-foreground">Bem vindo!</CardTitle>
        <CardDescription className="text-card-foreground/70 font-sans">
          Faça seu cadastro para continuar
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-card-foreground font-sans">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-white/40 bg-white/10 placeholder:text-card-foreground/50 text-card-foreground py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/40 bg-white/10 placeholder:text-card-foreground/50 text-card-foreground py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-card-foreground font-sans">
              Confirme sua senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-white/40 bg-white/10 placeholder:text-card-foreground/50 text-card-foreground py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center font-sans">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full ripple-effect hover-lift font-sans font-bold py-5 transition-all duration-300"
            style={{ backgroundColor: "#0C115B", color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </Button>

          <div className="relative flex justify-center text-sm text-card-foreground/60 font-sans">
            <span>
              Já tenho uma conta,{" "}
              <a className="text-blue-400 hover:text-blue-500 cursor-pointer" href="/auth/sign-in">
                entrar
              </a>
            </span>
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
