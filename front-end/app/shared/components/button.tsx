interface ButtonProps {
    placeholder: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function Button({ placeholder, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`flex flex-wrap items-center gap-2 bg-purple-900 min-h-16 w-full text-gray-200 rounded-2xl border border-neutral-700 justify-center ${disabled ? 'opacity-70 cursor-not-allowed hover:bg-purple-900' : 'cursor-pointer hover:bg-purple-800'}`}
      onClick={onClick}
      type="submit"
      disabled={disabled || false}
    >
      {placeholder}
    </button>
  )
}
