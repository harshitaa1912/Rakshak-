import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="glass-card relative w-full max-w-lg overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-emerald-900/10 bg-[var(--color-surface)]">
          <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 transition bg-transparent border-none"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
