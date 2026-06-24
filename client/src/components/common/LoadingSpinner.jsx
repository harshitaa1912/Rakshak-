import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] h-full">
      <div className="w-12 h-12 border-4 border-[var(--color-surface-hover)] border-t-[var(--color-primary-500)] rounded-full animate-spin"></div>
      {message && <p className="mt-4 text-stone-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
