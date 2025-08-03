'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/shared/components/button';
import Input from '@/shared/components/input';

import AuthModeToggle from '@/(core)/auth/components/authModeToggle';
import Form from '@/(core)/auth/components/form';

import request from '@/shared/utils/request';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordBlur, setPasswordBlur] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordBlur, setConfirmPasswordBlur] = useState(true);
  const [inputStatus, setInputStatus] = useState<'default' | 'error' | 'warning'>('default');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const req = {
      method: 'POST' as const,
      data: {
        name,
        email,
        password
      }
    };

    const response = await request('http://localhost:5000/auth/sign-up', req)
    console.log(response)

    if(!response || response.statusCode !== 200) {
      return toast.error('Erro ao criar conta, verifique os dados e tente novamente');
    }

    return toast.success('Você está registrado! Seja bem vindo!');
  };

  useEffect(() => {
    if (password && confirmPassword && !passwordBlur && !confirmPasswordBlur) {
      if (password !== confirmPassword) {
        setInputStatus('error');
        setPasswordMessage('As senhas não coincidem');
        setCanSubmit(false);
      } else {
        setInputStatus('default');
        setPasswordMessage('');
        if (name && email) setCanSubmit(true);
      }
    } else {
      setInputStatus('default');
      setPasswordMessage('');
      setCanSubmit(false);
    }
  }, [password, confirmPassword, passwordBlur, confirmPasswordBlur, email, name]);

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex justify-center">
        <Image src="/logo.png" alt="logo" width={200} height={200} />
      </div>
      <p className="font-rubik font-extrabold text-4xl text- pb-8 text-gray-200 text-center">Crie sua conta</p>
      <Input
        name="name"
        label="Nome"
        id="email"
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        name="email"
        label="E-mail"
        id="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="grid grid-cols-2 w-full gap-5">
        <Input
          label="Senha"
          name="password"
          id="password"
          type="password"
          status={inputStatus}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setPasswordBlur(false)}
          onFocus={() => setPasswordBlur(true)}
        />
        <Input
          label="Confirme sua senha"
          name="confirmPassword"
          id="password"
          type="password"
          status={inputStatus}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setConfirmPasswordBlur(false)}
          onFocus={() => setConfirmPasswordBlur(true)}
        />
        { passwordMessage && (
          <h1 className={`text-red-500 ${passwordMessage.length === 0 ? 'hidden' : ''}`}>{passwordMessage}</h1>
        )}
      </div>
      <Button placeholder="Criar conta" disabled={!canSubmit}/>
      <AuthModeToggle className="pt-8"/>
    </Form>
  );
}

export default SignUp;
