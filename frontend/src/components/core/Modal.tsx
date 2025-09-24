"use client";
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-lg relative animate-in fade-in-0 zoom-in-95" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-white transition-colors rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};