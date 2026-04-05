import React from 'react';
import { formatBboxToCenterHundreds } from '../utils/bboxUtils';

interface AnswerDisplayProps {
  answer: string;
  status?: string | null;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer, status }) => {
  // Если нет ни ответа, ни статуса — не рисуем ничего
  if (!answer && !status) return null;

  // Обрабатываем ответ: если его нет, выводим пустую строку
  const processedAnswer = answer ? formatBboxToCenterHundreds(answer) : '';

  return (
    <div className="w-full p-4 bg-base-100 rounded-box border border-base-300 shadow-sm mt-4 flex flex-col gap-2">
      <h3 className="font-bold text-lg text-primary">Ответ нейросети:</h3>

      {/* Если ответа еще нет, но идет процесс (есть статус) — показываем только лоадер без текста */}
      {!answer && status && (
        <div className="flex items-center gap-2">
          <span className="loading loading-dots loading-sm text-base-content/50"></span>
        </div>
      )}

      {/* Блок ответа: если answer пустой, здесь будет пустая строка */}
      <div 
        aria-live="assertive" 
        className="whitespace-pre-wrap text-base leading-relaxed"
      >
        {processedAnswer}
      </div>
    </div>
  );
};

export default AnswerDisplay;
