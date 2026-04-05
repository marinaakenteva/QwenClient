import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseWebSocketResult {
  isConnected: boolean;
  answer: string;
  error: string | null;
  status: string | null;
  sendMessage: (image: string | null, text: string) => void;
}

export const useWebSocket = (url: string): UseWebSocketResult => {
  const [isConnected, setIsConnected] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // Если уже подключены или в процессе, ничего не делаем
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'ready':
            setIsConnected(true);
            setError(null);
            setStatus(null);
            break;
          case 'status':
            setStatus(data.message);
            break;
          case 'answer':
            setAnswer(data.answer);
            setStatus(null);
            break;
          case 'error':
            setError(data.message);
            setStatus(null);
            break;
          default:
            console.warn('Неизвестный тип сообщения:', data.type);
            break;
        }
      } catch (e) {
        console.error('Ошибка парсинга сообщения от сервера', e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Пытаемся переподключиться каждые 5 секунд (полезно при долгом холодном старте)
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    };

    ws.onerror = () => {
      // Ошибка приведет к закрытию соединения, что вызовет onclose и реконнект
      ws.close();
    };
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((image: string | null, text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('Нет подключения к серверу');
      return;
    }

    if (!image) {
      setError('Изображение обязательно для отправки');
      return;
    }

    const payload = {
      image_base64: image,
      question: text || 'Опиши изображение'
    };

    wsRef.current.send(JSON.stringify(payload));
    setAnswer(''); // Очищаем предыдущий ответ
    setError(null);
    setStatus('Отправка запроса...');
  }, []);

  return { isConnected, answer, error, status, sendMessage };
};