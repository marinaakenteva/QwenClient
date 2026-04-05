import React from 'react';

const ConnectingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[50vh]">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <h2 className="text-2xl font-semibold">Подключение к нейросети...</h2>
      <p className="text-sm text-base-content/70 max-w-md">
        Пожалуйста, подождите. Если сервер находился в спящем режиме, холодный старт может занять до 5 минут.
      </p>
    </div>
  );
};

export default ConnectingScreen;