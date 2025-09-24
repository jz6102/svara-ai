import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={`w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700
          focus:outline-none focus:ring-2 focus:ring-zinc-500
          ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';