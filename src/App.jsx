import React from 'react';
import ChatInput from './components/ChatInput';
import ConnectingScreen from './components/ConnectingScreen';
import AnswerDisplay from './components/AnswerDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import { useWebSocket } from './hooks/useWebSocket';

// Укажите здесь ваш реальный WebSocket URL (можно вынести в .env)
const WS_URL = 'wss://marinaakenteva--vllm-websocket-server-vllmwebsocketserve-9758b1.modal.run/ws';

function App() {
  const { 
    isConnected, 
    answer, 
    error, 
    status, 
    sendMessage 
  } = useWebSocket(WS_URL);

  const handleSend = (payload) => {
    sendMessage(payload.image, payload.text);
  };

  // Блокируем ввод, пока идет отправка или генерация
  const isProcessing = status === 'Отправка запроса...' || status === 'Генерация ответа...';

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Qwen Vision</h1>
          <p className="text-sm opacity-70 mt-1">Сфотографируйте и задайте вопрос нейросети</p>
        </header>

        {!isConnected ? (
          <ConnectingScreen />
        ) : (
          <div className="flex flex-col gap-4">
            <ChatInput 
              onSend={handleSend} 
              disabled={isProcessing}
            />

            <ErrorDisplay error={error} />

            <AnswerDisplay answer={answer} status={status} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;