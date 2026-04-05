/**
 * Проверяет, является ли строка массивом координат [xmin, ymin, xmax, ymax]
 * и преобразует их в формат "X Y", где X и Y — сотни центра объекта.
 */
export const formatBboxToCenterHundreds = (text: string): string => {
  // Регулярное выражение для поиска формата [число, число, число, число]
  const bboxRegex = /^\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\]$/;
  const match = text.trim().match(bboxRegex);

  if (!match) {
    return text; // Возвращаем исходный текст, если формат не совпал
  }

  // Извлекаем координаты
  const xmin = parseInt(match[1], 10);
  const ymin = parseInt(match[2], 10);
  const xmax = parseInt(match[3], 10);
  const ymax = parseInt(match[4], 10);

  // Находим центр
  const centerX = (xmin + xmax) / 2;
  const centerY = (ymin + ymax) / 2;

  // Берем только сотни (делим на 100 и округляем вниз)
  const xHundreds = Math.floor(centerX / 100);
  const yHundreds = Math.floor(centerY / 100);

  return `${xHundreds} ${yHundreds}`;
};
