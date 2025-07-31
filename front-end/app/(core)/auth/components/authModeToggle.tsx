'use client'
import { usePathname, useRouter } from 'next/navigation'

import cn
  from '@/shared/utils/cn';

interface AuthModeToggleProps {
  className: string;
}

function AuthModeToggle({ className }: AuthModeToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  const signIn = { informative: 'Não tem uma conta?', action: 'Crie aqui' }
  const signUp = { informative: 'Já tem uma conta?', action: 'Acesse aqui' }

  const isActive = (path: string) => pathname.includes(path);

  const currentText = isActive('/auth/sign-in') ? signIn : signUp;
  const destinationPage = isActive('/auth/sign-in') ? '/auth/sign-up' : '/auth/sign-in';

  return (
    <div className={cn('flex space-x-2 text-gray-200', className)}>
      <p>{currentText.informative}</p>
      <a className="text-blue-500 cursor-pointer hover:text-blue-400" onClick={() => router.push(destinationPage)}><u><b>{currentText.action}</b></u></a>
    </div>
  );
}

export default AuthModeToggle;
