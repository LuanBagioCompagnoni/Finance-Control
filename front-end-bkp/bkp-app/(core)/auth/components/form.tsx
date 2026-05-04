import React from 'react';

import cn
  from '@/shared/utils/cn';

interface PageLayoutProps {
    children?: React.ReactNode;
    className?: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

function Form({ children, className, onSubmit }: PageLayoutProps) {
  return (
    <div className="animate-rotate-border h-[95%] rounded-2xl bg-conic/[from_var(--border-angle)] from-black via-purple-500 to-black p-[2px]">
      <form
        className={cn('w-full h-full bg-neutral-950 rounded-2xl relative flex flex-col space-y-5 justify-center p-5', className)}
        onSubmit={onSubmit}
      >
        { children }
      </form>
    </div>
  );
}

export default Form;
