import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors
        bg-primary text-primary-foreground hover:bg-primary/90
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};