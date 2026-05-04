interface ButtonProps {
    placeholder: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function Button({ placeholder, onClick, disabled }: ButtonProps) {
    return (
        <button
            className={`
        flex flex-wrap items-center gap-2
        bg-gradient-to-bl from-violet-600 via-fuchsia-500 to-violet-600
        bg-[length:300%_300%] bg-left-bottom
        min-h-16 w-full text-gray-200 rounded-2xl justify-center
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-right-top transition-[background-position] duration-700 ease-in-out'}
      `}
            onClick={onClick}
            type="submit"
            disabled={disabled || false}
        >
            {placeholder}
        </button>
    )
}
