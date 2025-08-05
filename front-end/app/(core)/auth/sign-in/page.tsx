"use client"
import Image
  from 'next/image';

import { Button } from '@/shared/components/button';
import Input from '@/shared/components/input';

import AuthModeToggle
  from '@/(core)/auth/components/authModeToggle';
import Form from '@/(core)/auth/components/form';
import React, {useEffect, useState} from "react";
import request from "@/shared/utils/request";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

function SignIn() {
    const router = useRouter()
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [canSubmit, setCanSubmit] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const req = {
            method: 'POST' as const,
            data: {
                email,
                password
            }
        };

        const response = await request('http://localhost:5000/auth/sign-in', req)

        if(!response || response.statusCode !== 200) {
            return toast.error('E-mail ou senha incorretos!');
        }

        router.push('/');
        return toast.success('Seja bem vindo!');
    };

    useEffect(() => {
        if (!password && !email) {
            setCanSubmit(false);
        } else {
            setCanSubmit(true);
        }
    }, [password, email]);

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex justify-center">
        <Image src="/logo.png" alt="logo" width={200} height={200}/>
      </div>
      <p className="font-rubik font-extrabold text-4xl text- pb-8 text-gray-200 text-center">Entre em sua conta</p>
      <Input
        label="E-mail"
        name="email"
        id="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Senha"
        name="password"
        id="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button placeholder="Entrar" disabled={!canSubmit}/>
      <AuthModeToggle className="pt-8"/>
    </Form>
  );
}

export default SignIn;
