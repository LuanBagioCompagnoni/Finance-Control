import Image
  from 'next/image';

import { Button } from '@/shared/components/button';
import Input from '@/shared/components/input';

import AuthModeToggle
  from '@/(core)/auth/components/authModeToggle';
import Form from '@/(core)/auth/components/form';

function SignIn() {
  return (
    <Form>
      <div className="flex justify-center">
        <Image src="/logo.png" alt="logo" width={200} height={200}/>
      </div>
      <p className="font-rubik font-extrabold text-4xl text- pb-8 text-gray-200 text-center">Entre em sua conta</p>
      <Input
        label="E-mail"
        name="email"
        id="email"
        type="email"
      />
      <Input
        label="Senha"
        name="password"
        id="password"
        type="password"
      />
      <Button placeholder="Entrar"/>
      <AuthModeToggle className="pt-8"/>
    </Form>
  );
}

export default SignIn;
