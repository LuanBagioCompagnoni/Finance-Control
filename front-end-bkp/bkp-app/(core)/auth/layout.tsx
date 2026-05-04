import React from 'react';
import Image
  from 'next/image';

import { Particles } from '@/shared/components/particles';

interface PageLayoutProps {
    children?: React.ReactNode;
}

export default function Layout({ children }: PageLayoutProps) {
  return (
    <div className="md:p-4 flex w-full h-full bg-black shrink">
      <Particles
        className="absolute inset-0 z-0"
        quantity={600}
        ease={80}
        refresh
      />
      <div className="w-full h-full flex">
        <div className="flex flex-col h-full justify-center shrink w-[35%]">
          {children}
        </div>
        <div className="h-full w-full max-w-[65%] justify-center items-center flex flex-col">
          <Image src="/logo.png" alt="logo" width={200} height={200} />
          <div className="flex text-6xl font-bold font-rubik text-gray-200">
                Finance Control
          </div>
        </div>
      </div>
    </div>
  );
}
