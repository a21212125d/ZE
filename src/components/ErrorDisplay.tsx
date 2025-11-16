
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div
    className="bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded-lg relative flex items-center shadow-lg max-w-lg mx-auto"
    role="alert"
  >
    <ErrorIcon />
    <div>
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  </div>
);

export default ErrorDisplay;