import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { PresetQueries } from './PresetQueries';

export interface SendPayload {
  text: string;
  image: string | null;
}

interface ChatInputProps {
  onSend: (payload: SendPayload) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [text, setText] = useState<string>('');

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [a11yMessage, setA11yMessage] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const imageRef = useRef<string | null>(null);
  const [hasImage, setHasImage] = useState(false);

  const isInputDisabled = disabled;

  // ---------------------------------------------------------------------------
  // КАМЕРА
  // ---------------------------------------------------------------------------

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (_) {}
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error('[Camera Error]', err);
      setCameraError('Нет доступа к камере. Проверьте разрешения.');
      setA11yMessage('Ошибка: Нет доступа к камере');
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleSwitchCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    setA11yMessage(newMode === 'user' ? 'Включена фронтальная камера' : 'Включена основная камера');
  };

  const captureImageBase64 = useCallback((): string | null => {
    if (!isCameraReady || !videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    if (video.readyState < 2) return null;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
  }, [isCameraReady]);

  const handleCameraClick = useCallback(() => {
    const base64Data = captureImageBase64();
    if (base64Data) {
      imageRef.current = base64Data;
      setHasImage(true);
      setA11yMessage('Фотография прикреплена');
    } else {
      setA11yMessage('Камера ещё не готова');
    }
  }, [captureImageBase64]);

  const clearImage = useCallback(() => {
    imageRef.current = null;
    setHasImage(false);
  }, []);

  // ---------------------------------------------------------------------------
  // ПРЕСЕТЫ
  // ---------------------------------------------------------------------------

  const handleQuickSendWithPhoto = useCallback((presetQuery: string) => {
    const base64Data = captureImageBase64();
    if (!base64Data) {
      setA11yMessage('Камера не готова.');
      return;
    }
    onSend({ text: presetQuery, image: base64Data });
    clearImage();
  }, [captureImageBase64, onSend, clearImage]);

  // ---------------------------------------------------------------------------
  // ОТПРАВКА
  // ---------------------------------------------------------------------------

  const handleSend = useCallback(() => {
    const currentImage = imageRef.current;
    const currentText = text.trim();

    if (!currentText && !currentImage) return;

    onSend({ text: currentText, image: currentImage });

    setText('');
    imageRef.current = null;
    setHasImage(false);
    setA11yMessage('Сообщение отправлено');
  }, [text, onSend]);

  // ---------------------------------------------------------------------------
  // ГОРЯЧИЕ КЛАВИШИ
  // ---------------------------------------------------------------------------

  useHotkeys('pagedown', (e) => {
    e.preventDefault();
    if (!isInputDisabled) handleCameraClick();
  }, { enableOnFormTags: true }, [handleCameraClick, isInputDisabled]);

  useHotkeys('right', (e) => {
    e.preventDefault();
    if (!isInputDisabled && (text.trim() || imageRef.current)) handleSend();
  }, { enableOnFormTags: true }, [handleSend, isInputDisabled, text]);

  // ---------------------------------------------------------------------------
  // РЕНДЕР
  // ---------------------------------------------------------------------------

  return (
    <div className={`flex flex-col gap-2 w-full p-2 bg-base-200 rounded-box border border-base-300 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>

      <div aria-live="polite" className="sr-only">{a11yMessage}</div>
      <canvas ref={canvasRef} className="hidden" />

      {/* ЖИВОЕ ВИДЕО */}
      <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {cameraError ? (
          <div className="text-error text-sm text-center p-4">{cameraError}</div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            )}
            <button
              type="button"
              className="absolute top-2 right-2 btn btn-circle btn-sm btn-neutral opacity-80"
              onClick={handleSwitchCamera}
              aria-label="Переключить камеру"
            >
              🔄
            </button>
          </>
        )}
      </div>

      {/* ПРЕСЕТЫ */}
      <PresetQueries
        onQuickSendWithPhoto={handleQuickSendWithPhoto}
        isDisabled={isInputDisabled || !isCameraReady}
      />

      {/* ПАНЕЛЬ ВВОДА */}
      <div className="flex items-end gap-2 mt-1">
        <textarea
          className="textarea textarea-bordered flex-grow resize-none min-h-[2.5rem] max-h-32"
          placeholder="Введите сообщение..."
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isInputDisabled}
        />

        <div className="flex gap-1 pb-1">
          {/* Снимок */}
          <button
            type="button"
            className={`btn btn-circle btn-sm ${hasImage ? 'btn-success' : isCameraReady ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={handleCameraClick}
            disabled={isInputDisabled || !isCameraReady}
            aria-label="Сделать снимок"
          >
            📷
          </button>

          {/* Отправить */}
          <button
            type="button"
            className="btn btn-circle btn-primary btn-sm"
            onClick={handleSend}
            disabled={isInputDisabled || (!text.trim() && !hasImage)}
            aria-label="Отправить"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
