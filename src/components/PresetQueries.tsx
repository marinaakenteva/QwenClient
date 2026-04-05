import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { PRESETS } from './presets';

interface PresetQueriesProps {
  onQuickSendWithPhoto: (query: string) => void;
  isDisabled?: boolean;
}

export function PresetQueries({ onQuickSendWithPhoto, isDisabled = false }: PresetQueriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Стрелка ВНИЗ: следующий пресет
  useHotkeys('down', (e) => {
    e.preventDefault();
    if (isDisabled) return;
    setCurrentIndex((prev) => (prev + 1) % PRESETS.length);
  }, { enableOnFormTags: true }, [isDisabled]);

  // Стрелка ВВЕРХ: предыдущий пресет
  useHotkeys('up', (e) => {
    e.preventDefault();
    if (isDisabled) return;
    setCurrentIndex((prev) => (prev - 1 + PRESETS.length) % PRESETS.length);
  }, { enableOnFormTags: true }, [isDisabled]);

  // Стрелка ВЛЕВО: сделать фото и отправить текущий пресет
  useHotkeys('left', (e) => {
    e.preventDefault();
    if (isDisabled) return;
    onQuickSendWithPhoto(PRESETS[currentIndex].query);
  }, { enableOnFormTags: true }, [currentIndex, isDisabled, onQuickSendWithPhoto]);

  const currentPreset = PRESETS[currentIndex];

  return (
    <div className="w-full bg-base-300 p-2 rounded-lg border border-base-content/10">
      {/* Видимый лейбл текущего пресета */}
      <div className="font-bold text-primary text-sm sm:text-base">
        {currentPreset.label}
      </div>

      {/* Скрытый элемент для скринридера: озвучивает текст запроса при смене */}
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {currentPreset.label}
      </div>
    </div>
  );
}
