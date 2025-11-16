import React from 'react';

interface PromptDisplayProps {
  prompt: string;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => {
  return (
    <div className="max-w-3xl mx-auto mb-8">
      <h4 className="text-lg font-semibold text-gray-400 text-center mb-3">Generated Prompt</h4>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-inner">
        <p className="text-gray-300 font-mono text-sm whitespace-pre-wrap select-all">{prompt}</p>
      </div>
    </div>
  );
};

export default PromptDisplay;