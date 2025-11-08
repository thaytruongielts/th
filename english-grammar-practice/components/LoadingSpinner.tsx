
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-secondary font-semibold">Generating your exercises...</p>
    </div>
  );
};
