'use client'

import React, { useState } from 'react';
import { cva } from 'class-variance-authority';

import Eye
  from '@/shared/components/icons/eye';
import EyeSlash
  from '@/shared/components/icons/eye-slash';

import cn from '@/shared/utils/cn';

interface InputProps {
    className?: string;
    id?: string;
    name?: string;
    status?: 'default' | 'error' | 'warning',
    type: string;
    value?: string | number | readonly string[];
    isRequired?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    onBlur?: () => void;
    onFocus?: () => void;
}

const inputVariants = cva(
  'flex size h-16 w-full rounded-xl bg-neutral-900 border-neutral-700 pl-3 pr-3 pb-0 pt-4 text-base focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      status: {
        default: 'border-neutral-700 text-neutral-400 placeholder:text-muted-foreground placeholder:text-gray-1000 focus-visible:border-primary-600',
        error: 'border-red-600 text-red-600',
        warning: 'border-orange-600 text-orange-600'
      }
    },
    defaultVariants: {
      status: 'default'
    }
  }
);

const textVariants = cva('', {
  variants: {
    status: {
      default: 'text-neutral-300',
      error: 'text-red-600',
      warning: 'text-orange-600',
      success: 'text-green-600'
    }
  },
  defaultVariants: {
    status: 'default'
  }
});

function Input({ className, id, name, status, type, value, isRequired, onChange, label, onBlur, onFocus }: InputProps ) {
  const [text, setText] = useState(value ? String(value) : '');
  const [isFocused, setIsFocused] = useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [hasInput, setHasInput] = useState(!!value);

  const handleFocus = () => {
    setIsFocused(true);
      if (onFocus) {
          onFocus()
      }
  }

  const handleBlur = (e: React.FocusEvent) => {
    setIsFocused(false);
    if (onBlur) {
        onBlur()
    }
  }

  const handleShowPassword = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setPasswordIsVisible(true);
  };

  const handleHidePassword = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setPasswordIsVisible(false);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    setHasInput(!!event.target.value);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="relative w-full text-neutral-300">
      <label className={cn(`absolute top-1/3 left-3 transition-all ${(isFocused || hasInput) && 'mt-1 transform -translate-y-full text-sm -translate-x-2' } px-2 pointer-events-none flex items-center gap-1`, textVariants({ status, className }))}>
        {label}

        {isRequired && (<span className="text-red-600 text-base">*</span>)}
      </label>
      <input
        name={name}
        type={passwordIsVisible ? 'text' : type}
        id={id}
        className={cn('h-full w-full placeholder-neutral-300 bg-neutral-900 border border-neutral-700 text-sm rounded-xl block px-2.5 focus:outline-none', inputVariants({ status, className }))}
        required
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleOnChange}
        value={text}
      />

      { type === 'password' && !passwordIsVisible && (
        <Eye className="fill-neutral-300 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={handleShowPassword} />
      ) }

      { passwordIsVisible && (
        <EyeSlash className="fill-neutral-300 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={handleHidePassword} />
      )}
    </div>
  );
}

export default Input;
