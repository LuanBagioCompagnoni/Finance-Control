'use client';

import React from 'react';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>

export default function Toaster({ ...props }: ToasterProps) {

  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          title: 'font-bold',
          closeButton: 'bg-inherit border-inherit hover:bg-inherit',
          description: 'group-[.toast]:text-muted-foreground font-normal',
          default: 'bg-gray-100 dark:bg-gray-300 border-1 border-gray-300 dark:border-gray-500 text-gray-900',
          error: 'bg-red-600 border-1 border-red-400 text-red-1000',
          success: 'bg-green-100 dark:bg-green-300 border-1 border-green-200 dark:border-green-400 text-green-600 dark:text-green-1000',
          info: 'bg-blue-100 dark:bg-blue-300 border-1 border-blue-200 dark:border-blue-400 text-blue-600 dark:text-blue-1000',
          warning: 'bg-yellow-100 dark:bg-yellow-300 border-1 border-yellow-200 dark:border-yellow-400 text-orange-600 dark:text-orange-1000'
        },
        actionButtonStyle: { backgroundColor: 'inherit', color: 'inherit' }
      }}
      closeButton={true}
      duration={3000}
      position="bottom-right"
      visibleToasts={6}
      expand={true}
      {...props}
    />
  );
}
