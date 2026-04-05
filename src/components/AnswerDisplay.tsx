import React from 'react';

interface AnswerDisplayProps {
  answer: string;
  status?: string | null;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer, status }) => {
  if (!answer && !status) return null;

  return (
    <div className="w-full p-4 bg-base-100 rounded-box border border-base-300 shadow-sm mt-4 flex flex-col gap-2">
      <h3 className="font-bold text-lg text-primary">Ответ нейросети:</h3>

      {status && !answer && (
        <div className="flex items-center gap-2 text-base-content/70 italic">
          <span className="loading loading-dots loading-sm"></span>
          <span>{status}</span>
        </div>
      )}

      {answer && (
        <div 
          aria-live="assertive" 
          className="whitespace-pre-wrap text-base leading-relaxed"
        >
          {answer}
        </div>
      )}
    </div>
  );
};

export default AnswerDisplay;